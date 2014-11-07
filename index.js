var animation_running = 0;

function g(x)
{
  return document.getElementById(x);
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
}

function resize_divs()
{
  if ( window.innerWidth >= 767 )
  {
    g("rightdiv").style.height = (window.innerHeight-40) + "px";
    g("imagediv").style.height = (window.innerHeight-120) + "px";

    $("#overall_image").load(function()
    {
      center_image();
    });

    center_image();
  }
  else
  {
    g("rightdiv").style.height = "100%";
    g("imagediv").style.height = "100%";
    g("overall_image").style.marginTop = "0px";
  }
}

function center_image()
{
  var ht = g("overall_image").height;

  g("overall_image").style.marginTop = ((window.innerHeight-120-ht)/2)+"px";
}
