<?php

?>
<html>
<head>
	<title>Battleships</title>
	<script src="//code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="/socket.io/socket.io.js"></script>
	<script src="/js.js"></script>
</head>
<body style="background-color: black; color:white; text-align:center">
<div style="width=100%; text-align:center;">
	<h1 style="color: white"><?php ?></h1>
</div>
<?php
	print '<h1>Your board</h1>';
	print '<div style="width: 500px; position:relative; padding: 0; margin: 0" >';
	for( $i = 0; $i < 11; $i++ )
	{
		if( $i != 0 )
		{
			print '<div style="float:left; width: 40px; height: 40px; border: white 1px solid"> ' . $i . ' </div>';
		}
		for( $j = 0; $j < 11; $j++ )
		{
			if( $i == 0 )
			{
				print '<div style="float:left; width:40px; height:40px; border: white 1px solid" >' . $j . '</div>';
			}
			else
			{
				if( $j != 0 )
				{
					print '<div id="' . $i . '-' . $j . '" class="click-cell" style="float:left; width: 40px; height:40px; border: white 1px solid" ></div>';
				}
			}
		}
	}
	print '</div>';

	print '<h1>Enemy ship</h1>';

?>
</body>
</html>