(function() {
  var timeSince;

  timeSince = function(date) {
    var interval, seconds;
    seconds = Math.floor((new Date() - date) / 1000);
    interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " mins ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  $(function() {
    $('.date').each(function(idx, item) {
      var $date, date, timeStr, unixTime;
      $date = $(item);
      timeStr = $date.data('time');
      if (timeStr) {
        unixTime = Number(timeStr) * 1000;
        date = new Date(unixTime);
        return $date.prop('title', date).find('.from').text(timeSince(date));
      }
    });
    $('pre code').each(function(i, block) {
      return hljs.highlightBlock(block);
    });
    $('img').each(function(idx, item) {
      var $item, imageAlt;
      $item = $(item);
      if ($item.attr('data-src')) {
        $item.attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAB+UlEQVRYR+2XQSgFQRjH30sppUgp5SDlJqLkLMVJSinF5TkppaSUg5QiclDKhYgLcSEHOUgpUopycXBSclbipMT/r9nXmHa93ZnvrUc79W93Z+f7vt/+Z2fe23SqwFu6wPlSCaDrDCUOJg66OuAa/2ffwQo8+QrU6+pAxPhtjB+Bnry4IAdPMKA9YnKp4YdI1JUL8EOqmkWeZ8SURwGM6z31TPnfgEWwfgzqh96gVWjdYhr9QkQcnEbmKSP7IK43Q0BmMIbTtx8wVgTwEcmrjQLXuG7JAdiE+xcKsB7H7DaixYkAviBhqQFzg+vmHwDLcO8KqlNj6DZdN5sI4AKyjhuZubEua33dOG+AZlXfAY7s01snLo6NPhHAEiSdgfgLw0XCBTKvFWrF+SnEccMQ3ZvzcesefY3Qq3ZPBNCnVrarFmeXUKU26B3nXPl+bQmdo3EB0qkziFMbthG+DTpXAXlzsBgFjiCb3+47NdV8XcQAO5RTi+rJt3Dkxm3buJgmpQA5lbcQ90IC8sknbMlU3AOONVKAG0iUcQQyw8UAuZdxT5NuIoD8h82prZKmQz4RwB0k6ssDHFOKAOaJ7Vta620mDji9Rqh/1HuI6ImbTNXjl92AVzvoe4OLYu0XIHdRcwiii18trg8i68lIAK2tS6bY1brEQSEHPwHGT3gpenNNIQAAAABJRU5ErkJggg==');
        $item.wrap('<a href="' + $item.attr('data-src') + '" target="_blank"></a>');
        imageAlt = $item.prop('alt');
        if ($.trim(imageAlt)) {
          return $item.parent('a').after('<div class="image-alt">' + imageAlt + '</div>');
        }
      }
    });
    if ($('img').unveil) {
      return $('img').unveil(200, function() {
        return $(this).load(function() {
          return this.style.opacity = 1;
        });
      });
    }
  });

}).call(this);
