var images =
[
  "OpenPhysiologySite_1.png",
  "OpenPhysiologySite_2.png",
  "OpenPhysiologySite_3.png",
  "OpenPhysiologySite_4.png"
];

var animation_running = 0;
var publications_shown = 0;

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

  animation_running = 1;

  $(".tabs").each(function()
  {
    if ( this.id == x )
      $(this).show(250, function()
      {
        animation_running = 0;
      });
    else
      $(this).hide(250);
  });

  if ( publications_shown == 1 )
  {
    publications_shown = 0;
    $("#publicationsdiv").fadeOut(100,function()
    {
      $("#imagediv_inner").fadeIn(150);
    });
  }
}

function publicationsclicked()
{
  if ( animation_running == 1 )
    return;

  $('html, body').animate
  (
    {
      scrollTop: $("#imagediv").offset().top
    },
    250
  );

  if ( publications_shown == 1 )
    return;

  $(".tabs").each(function()
  {
    $(this).hide(250);
  });

  animation_running = 1;
  publications_shown = 1;

  g("imagediv").style.display = "block";
  $("#imagediv_inner").fadeOut(100, function()
  {
    $("#publicationsdiv").fadeIn(150, function()
    {
      animation_running = 0;
    });
  });
}

function pubsclick(x)
{
  if ( animation_running == 1 )
    return;

  animation_running = 1;

  if ( $("#"+x).is(":visible") )
  {
    $("#"+x).hide(250, function()
    {
      animation_running = 0;
      g(x+"_link").innerHTML = "+" + $("#"+x+"_link").html().substring(1);
    });
  }
  else
  {
    $("#"+x).show(250, function()
    {
      animation_running = 0;
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
  $("#overall_image").delay(250).queue( function()
  {
    // Preload images to avoid jumpiness
    for ( var i = 1; i < images.length; i++ )
      (new Image()).src = "http://open-physiology.org/images/"+images[i];
  })
  .delay(3000-250).fadeOut(500, function()
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
