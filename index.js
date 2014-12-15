var images =
[
  "OpenPhysiologySite_1.png",
  "Movie2.gif",
  "OpenPhysiologySite_2.png",
  "OpenPhysiologySite_3_bdb.gif",
  "OpenPhysiologySite_4.png"
];

var animation_running = 0;
var left_taken_over = 0;

function g(x)
{
  return document.getElementById(x);
}

function is_portrait()
{
  if ( window.innerWidth < 480 ) return 1;
  return 0;
}

function is_landscape()
{
  if ( is_portrait() == 0 && window.innerWidth < 768 ) return 1;
  return 0;
}

function divclicked(x)
{
  if ( animation_running == 1 )
    return;

  set_animation(250);

  $(".tabs").each(function()
  {
    if ( this.id == x )
      $(this).show(250);
    else
      $(this).hide(250);
  });

  if ( left_taken_over == 1 )
  {
    left_taken_over = 0;

    $(".left_taker").fadeOut(100);

    setTimeout( function()
    {
      $("#imagediv_inner").fadeIn(150);
    }, 100 );

    resize_divs();
  }
}

function left_takeover(x)
{
  if ( animation_running == 1 )
    return;

  if ( $("#"+x).is(":visible") )
    return;

  set_animation(250);

  $('html, body').animate
  (
    {
      scrollTop: $("#imagediv").offset().top
    },
    250
  );

  $(".tabs").each(function()
  {
    $(this).hide(250);
  });

  if ( left_taken_over == 0 )
  {
    left_taken_over = 1;

    $("#imagediv_inner").fadeOut(100, function()
    {
      $("#"+x).fadeIn(150);
    });

    resize_divs();
  }
  else
  {
    $(".left_taker").hide();
    $("#"+x).fadeIn(250);
  }
}

function pubsclick(x)
{
  if ( animation_running == 1 )
    return;

  set_animation(250);

  if ( $("#"+x).is(":visible") )
  {
    $("#"+x).hide(250, function()
    {
      g(x+"_link").innerHTML = "+" + $("#"+x+"_link").html().substring(1);
    });
  }
  else
  {
    $("#"+x).show(250, function()
    {
      g(x+"_link").innerHTML = "-" + $("#"+x+"_link").html().substring(1);
    });
  }

  $(".pubs_tabs").each(function()
  {
    if ( this.id != x && $(this).is(":visible") )
      $(this).hide(250, function()
      {
        g(this.id+"_link").innerHTML = "+" + $("#"+this.id+"_link").html().substring(1);
      });
  });
}

function resize_divs()
{
  if ( is_portrait() == 0 )
  {
    if ( is_landscape() == 1 )
    {
      g("leftdiv").className = "eight columns";
      g("rightdiv").className = "eight columns floating-box";
      g("headerdiv").innerHTML = "<h3 id='openphysiology'>OpenPhysiology</h3>";
      g("imagediv").style.height = (window.innerHeight-105) + "px";
    }
    else
    {
      g("leftdiv").className = "eleven columns";
      g("rightdiv").className = "five columns floating-box";
      g("headerdiv").innerHTML = "<h2 id='openphysiology' style='margin-left:10px'>Open Physiology</h2>";
      g("imagediv").style.height = (window.innerHeight-115) + "px";
    }

    g("rightdiv").style.height = (window.innerHeight-40) + "px";

    $("#overall_image").load(function()
    {
      center_image();
    });
  }
  else
  {
    g("rightdiv").style.height = "100%";
    if ( left_taken_over == 0 )
      g("imagediv").style.height = (Math.floor(window.innerHeight / 3)) + "px";
    else
      g("imagediv").style.height = (Math.floor((window.innerHeight * 3)/4)) + "px";
  }

  center_image();
}

function center_image()
{
  var ht = g("overall_image").height;

  if ( is_portrait() == 0 )
    g("overall_image").style.marginTop = Math.floor(($("#imagediv").innerHeight() - ht)/2) + "px";
  else
    g("overall_image").style.marginTop = "0px";
}

var slidenumber = 0;

function init_slideshow()
{
  setTimeout(function()
  {
    /*
     * Preload images to reduce jerk
     */
    for ( var i = 1; i < images.length; i++ )
      (new Image()).src = "http://open-physiology.org/images/"+images[i];
  }, 250 );
  
  $("#overall_image").delay(3000).fadeOut(500, function()
  {
    update_slideshow();
  });
}

function update_slideshow()
{
  slidenumber++;

  if ( slidenumber >= images.length )
    slidenumber = 0;

  center_image();
  $("#overall_image").attr('src', 'http://open-physiology.org/images/'+encodeURIComponent(images[slidenumber]) );

  resize_divs();

  $("#overall_image").fadeIn(500, function()
  {
    resize_divs();

    $("#overall_image").delay(3000).fadeOut(500, function()
    {
      update_slideshow();
    });
  });
}

function set_animation(x)
{
  animation_running = 1;

  setTimeout(function()
  {
    animation_running = 0;
  }, x );
}
