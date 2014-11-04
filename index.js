var animation_running = 0;

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

  document.getElementById("imagediv").className = "seven columns";
  document.getElementById("rightdiv").className = "nine columns";
}

function image_click()
{
  document.getElementById("imagediv").className = "twelve columns";
  document.getElementById("rightdiv").className = "four columns";
}
