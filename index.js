var images =
[
  "OpenPhysiologySite_1.png",
  "Movie3.gif",
  "OpenPhysiologySite_2.png",
  "OpenPhysiologySite_3_bdb.gif",
  "OpenPhysiologySite_4.png"
];

var youtubes =
[
  {
    title: "Physiology Circuitboarding (June, 2014)",
    address: "https://www.youtube.com/embed/QtnrA25n19U",
    thumbnail: "http://open-physiology.org/images/youtube1.jpg"
  },
  {
    title: "Tissue knowledge management (Dec, 2014)",
    address: "https://www.youtube.com/embed/mxu1yS_ErAg",
    thumbnail: "http://open-physiology.org/images/youtube3.jpg"
  }
];

var animation_running = 0;
var left_taken_over = 0;
var youtube_initiated = 0;
var slideshow_paused = 0;

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

  if ( x == "demosdiv" && youtube_initiated == 0 )
  {
    youtube_initiated = 1;
    init_youtube();
  }

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

  var imgfoot_html = "";

  for ( var i = 0; i < images.length; i++ )
  {
    imgfoot_html +=
      "<a href='javascript:void(0);' onclick='img_select(" + i + ");'>" +
        "<img style='height:18px; width:18px; padding-left: 5px;' id='img_selector" + i + "' src='" + (i==0? "images/image_selected.png" : "images/image_unselected.png" ) + "'>" +
      "</a>";
  }
  $("#image_footer").html(imgfoot_html);

  setTimeout( function()
  {
    update_slideshow();
  }, 3000 );
}

function img_select(x)
{
  for ( var i = 0; i < images.length; i++ )
  {
    if ( i == x )
      $("#img_selector" + i).attr('src', 'images/image_selected.png');
    else
      $("#img_selector" + i).attr('src', 'images/image_unselected.png');
  }

  $("#overall_image").attr('src', 'http://open-physiology.org/images/'+encodeURIComponent(images[x]) );

  center_image();
  resize_divs();


  slideshow_paused = 1;

  return;
}

function init_youtube()
{
  init_youtube_holder();
  init_youtube_footer();
}

function init_youtube_holder()
{
  var youtube_html = "";

  for ( var i = 0; i < youtubes.length; i++ )
  {
    youtube_html +=
      "<div id='youtube" + i + "' style='height:100%;" + (i==0 ? "" : " display:none") + "'>" +
        "<iframe width='100%' height='100%' src='" + youtubes[i].address  + "' frameborder='0' allowfullscreen></iframe>" +
      "</div>";
  }

  g("youtube_holder").innerHTML = youtube_html;
}

function init_youtube_footer()
{
  var footer_html = "";

  for ( var i = 0; i < youtubes.length; i++ )
  {
    footer_html +=
      "<div style='display:inline-block; vertical-align: top; max-width: 33%'>" +
        "<ul style='display:inline'>" +
          "<li>" +
            "<a href='javascript:void(0)' onclick='switch_video(" + i + ");'>" +
              "<img src='" + youtubes[i].thumbnail + "' style='max-width: 75%'>" +
            "</a>" +
          "</li>" +
          "<li>" +
            youtubes[i].title +
          "</li>" +
        "</ul>" +
      "</div>";
  }

  g("youtube_footer").innerHTML = footer_html;
}

function switch_video(x)
{
  g("youtube_holder").innerHTML = "";

  init_youtube_holder();

  if ( x != 0 )
  {
    $("#youtube0").hide();
    $("#youtube"+x).show();
  }
}

function update_slideshow()
{
  if ( slideshow_paused == 1 )
    return;

  slidenumber++;

  if ( slidenumber >= images.length )
    slidenumber = 0;

  $("#overall_image").fadeOut(500, function()
  {
    center_image();
    $("#overall_image").attr('src', 'http://open-physiology.org/images/'+encodeURIComponent(images[slidenumber]) );

    for ( var i = 0; i < images.length; i++ )
    {
      if ( i == slidenumber )
        $("#img_selector" + i).attr('src', 'images/image_selected.png');
      else
        $("#img_selector" + i).attr('src', 'images/image_unselected.png');
    }

    resize_divs();

    $("#overall_image").fadeIn(500, function()
    {
      resize_divs();

      setTimeout( function()
      {
        update_slideshow();
      }, 3000 );
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
