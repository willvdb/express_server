function glow() 
{
    var image = document.getElementById('logo');
    image.src="pictures/glowgo.png";
}

function unglow() 
{
    var image = document.getElementById('logo');
    image.src="pictures/logo_2-1_small.png";
}

function hello()
{
	document.getElementById("opening_info").innerHTML = Date();
}
