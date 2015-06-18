var socket = io.connect( 'cantphase.me:1337' );
var id = Math.random() * 1000;
socket.emit( 'register', { 'id' : id } )
socket.on( 'ready', function()
{
	alert( "Game is starting" );
});

socket.on( 'shoot', function( data )
{
	$( "#" + data.id ).css( 'background-color', 'red' );
});

$( document ).ready( function()
{
	var selectedSize = 0;
	var left = false;
	var shipReady = false;
	var coords = "";

	$( document ).keypress( function( event )
	{
		if ( event.which == 13 && shipReady ) {
			AddOrRemoveShips( coords[0], coords[1], true, "hoverShip" );
			AddOrRemoveShips( coords[0], coords[1], false, "heldShip" );
		}

		if( event.which == 116 )
		{
			left = !left;
		}

		event.preventDefault();
		return false;
	});

	$( '.click-cell' ).click( function()
	{
		socket.emit( 'shoot', { id : $( this ).attr( 'id' ) } );
		$( this ).css( 'background-color' , 'red' );
	});

	$( '.personal-ships' ).hover( function()
	{
		coords = $( this ).attr( 'id').replace( 'y', '' ).split( '-' );
		AddOrRemoveShips( coords[0], coords[1], false, "hoverShip" );
		shipReady = true;
	},
	function()
	{
		coords = $( this ).attr( 'id').replace( 'y', '' ).split( '-' );
		AddOrRemoveShips( coords[0], coords[1], true, "hoverShip" );
		shipReady = false;
	});

	$( '.ships' ).click( function()
	{
		selectedSize = parseInt( $( this ).attr( 'size' ) );
	});

	function AddOrRemoveShips( startX, startY, remove, className )
	{
		var toPost = new Array();
		for( var i = 0; i < selectedSize; i++ )
		{
			var element, x, y;
			if( !left )
			{
				x = parseInt( startX ) + i;
				y = startY;
				element = $( '#y' + x + "-" + y );
			}
			else
			{
				x = startX;
				y = ( parseInt( startY ) + i );
				element = $( '#y' + x + "-" + y );
			}

			if( element.length == 0 ) continue;

			if( remove )
			{
				element.removeClass( className );
			}
			else
			{
				element.addClass( className );
			}

			if( className == "heldShip" )
			{
				toPost.push( x + "-" + y );
			}
		}

		if( toPost.length != 0 )
		{
			socket.emit( 'logShip', { entry : toPost, id : id });
		}
	}
});

window.onbeforeunload = function( e )
{
	socket.emit( 'quit', { 'id' : id } )
};