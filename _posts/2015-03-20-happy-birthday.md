---
layout: post
title: 生日快乐，斯屹
date: 2015-03-20 18:41:19.000000000 +08:00
categories:
- 时间机器
tags:
- Arduino
- EE
- birthday
- siyi
- tutorial
status: publish
type: post
published: true
---

今年过生日，爸爸耍了个小把戏——设计了一个个滚动液晶屏来娱乐小朋友，价格便宜新意足，特此记录

*编辑中，未完成*

## 效果展示放在开头

## 材料

## 硬件连接

## 软件预备

### 确定液晶屏地址

软件上的准备，首先需要确定液晶显示器的 I2C 总线地址，实际上，从接口板的接线是可以看出来的，不过，这里我们用一个简单的方法，打开 Arduino 开发环境，新建一个 sketch，在里面贴上[这个程序](https://gist.github.com/gnawux/10bbcc8bee2abf0bf310)。

确保 Arduino 连接好电脑后，点击向右侧的箭头（upload），将这个程序烧入 arduino，然后打开工具菜单的串口监视器（`Tools` -> `Serial Monitor`），就可以看到 Arduino 告诉我们，液晶的地址是多少了，我手头这个，地址是 `0x27`

### 液晶程序库

这个库可以让我们用非常简单的程序来控制1602液晶显示器，[原始下载链接位于这里](https://bitbucket.org/fmalpartida/new-liquidcrystal/downloads)，我重新上传到百度网盘，防止链接失效

    链接: http://pan.baidu.com/s/1jG9Xa7O 
	密码: xnvg

下载之后，还是在 Arduino 程序里 `Sketch` -> `Import Library...` -> `Add Library...` 选择下载的 `zip` 包就可以了。准备好程序之后，我们就可以开始了

## 软件程序

最终的软件很简单，程序非常短，如果不想看逐步介绍，直接[点开这里看程序](https://gist.github.com/gnawux/b3f6bb020a6f3a3e1c63)就可以了

### 引用库

和所有 C/C++ 程序一样，开头部分 include 我们要用的厍，这里需要包含我们刚刚下载导入的液晶程序库

	#include <Wire.h>
	#include <LCD.h>
	#include <LiquidCrystal_I2C.h> 

### 定义地址和引脚

刚才我们已经找到了液晶屏的 I2C 地址

    #define I2C_ADDR    0x27

然后是 I2C 接口板上面，转换芯片管脚和液晶屏的输入接口的对应关系，这个我至少见过两种排布，我的是这样

	#define BACKLIGHT_PIN  3
	#define En_pin  2
	#define Rw_pin  1
	#define Rs_pin  0
	#define D4_pin  4
	#define D5_pin  5
	#define D6_pin  6
	#define D7_pin  7

另有一种是这样：

	#define BACKLIGHT_PIN  7
	#define En_pin  4
	#define Rw_pin  5
	#define Rs_pin  6
	#define D4_pin  0
	#define D5_pin  1
	#define D6_pin  2
	#define D7_pin  3

这些信息可以从店家问到，或者用万用表量一下，不过看芯片的布置，应该以这两种排布为主，不太会有其他布置了，具体的说，这些引脚的用途是:

- En 又叫 CS，片选，这个引脚加高表示这个让这个芯片的接口工作
- Rw，读还是写
- Rs, 命令还是数据
- D[4-7]，4位宽的数据输入输出
- Backlight，背光开关

不过，我们有了程序库，只要这些引脚的位置确定了就好，不用单独去关心设置没一个引脚。用这些信息就可以初始化 Arduino 和液晶显示的连接了

	#define  LED_OFF  0
	#define  LED_ON  1
	LiquidCrystal_I2C  lcd(I2C_ADDR,En_pin,Rw_pin,Rs_pin,D4_pin,D5_pin,D6_pin,D7_pin,BACKLIGHT_PIN,POSITIVE);

### 准备文字

这是我们准备的文字

	const char* banners[] ={
	  " Happy birthday ",
	  "    to Siyi!    ",
	  " Wish you have  ",
	  " a better year! ",
	  "Welcome to Yi's ",
	  "Birthday party  "
	}; 

	char banner1[17];
	char banner2[17];

设计是这样的，每次取两行放在 `banner1` 和 `banner2` 里面，每隔一段时间换一下，当然，换的时候的滚动效果需要小小地处理一下，这个细节后面说。


### 定义主要流程

所有 Arduino 程序的主要流程都分成两部分——初始化和主循环。初始化在开始的时候执行一次，主循环不断地重复执行。

这里，我们的初始化会设置液晶的状态，准备好用于写液晶的内存，设定开始显示的行号

	void setup() 
	{
	  banner_init();
	  line = 0;
	 
	  lcd.begin (16,2);  // initialize the lcd
	  lcd.backlight();  
	  lcd.clear();
	  lcd.home();
	}

现在开始主循环

	void loop()  
	{
	  banner_transit(30);
	  delay(2000);
	  line = (line+2) % 6;
	}

主循环很简单：让新内容从右侧进入，替换掉原有内容，`30` 是左移的速度，越小越快，具体移法后面再说。内容进来之后，休息2秒时间，并把行号指向两行之后的内容，超出第六行之后回到开头。然后进入下一次循环。

主要流程很简单，下面把几个细节也贴出来

### 细节1: 初始化

初始化的思路就是准备好两行16个字符的空格，等着把字从右面串进来

	void banner_init() {
	  for(int i = 0; i<16;i++) {
		banner1[i] = ' ';
		banner2[i] = ' ';
	  }
	  banner1[16] = '\0';
	  banner2[16] = '\0';
	}

### 细节2: 走马灯效果

走马灯效果就是要让字看起来是从右侧飞进来的，实际上就是把已经有的内容左移一格，然后再把要进来的内容放在最右面一列

	void banner_transit(int step){
	  for(int i=0; i<16; i++) {
		strncpy(banner1, banner1 + 1, 15);
		strncpy(banner2, banner2 + 1, 15);
		banner1[15] = banners[line][i];
		banner2[15] = banners[line + 1][i];
		banner_display();
		delay(step);
	  }
	}

每移动一次，加入设置的毫秒值的延时，这样飞进来总共需要的时间就是 `16 * step` 长。

### 细节3: 具体字符显示

具体字符显示是标准例程，毫无原创性：

	void banner_display() {
	  lcd.setCursor(0,0); 
	  lcd.print(banner1);
	  lcd.setCursor(0,1); 
	  lcd.print(banner2);
	}


