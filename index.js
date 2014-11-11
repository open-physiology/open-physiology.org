var images =
[
  "OpenPhysiologySite_1.png",
  "OpenPhysiologySite_2.png",
  "OpenPhysiologySite_3.png",
  "OpenPhysiologySite_4.png"
];

var animation_running = 0;
var left_taken_over = 0;

function g(x)
{
  return document.getElementById(x);
}

function is_mobile()
{
  if ( window.innerWidth >= 767 ) return 0;
  return 1;
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
  }
}

function left_takeover(x)
{
  if ( animation_running == 1 )
    return;

  set_animation(250);

  if ( $("#"+x).is(":visible") )
    return;

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
  }
  else
  {
    $(".left_taker").fadeOut(100, function()
    {
      $("#"+x).fadeIn(150);
    });
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
  if ( is_mobile() == 0 )
  {
    g("rightdiv").style.height = (window.innerHeight-40) + "px";
    g("imagediv").style.height = (window.innerHeight-115) + "px";

    $("#overall_image").load(function()
    {
      center_image();
    });

    center_image();
  }
  else
  {
    g("rightdiv").style.height = "100%";
    g("imagediv").style.height = (Math.floor(window.innerHeight / 3)) + "px";
    center_image();
  }
}

function center_image()
{
  var ht = g("overall_image").height;

  g("overall_image").style.marginTop = Math.floor(($("#imagediv").innerHeight() - ht)/2) + "px";
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

  g("overall_image").style.marginTop = "0px";
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
