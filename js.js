var socket = io.connect( 'cantphase.me:1337' );
var id = Math.random() * 1000;
socket.emit( 'register', { 'id' : id } )
socket.on( 'ready', function()
{
	alert( "Game is starting" );
});

socket.on( 'shoot', function( data )
{
	$( "#" + data.id ).addClass( 'fired' );
	if( data.type == "hit" )
	{
		$( "#" + data.id ).addClass( 'hit' );
		$( "#" + data.id ).html( 'Hit!' );
	}
	else
	{
		$( "#" + data.id ).html( 'X' );
	}
	$( "#" + data.id ).removeClass( 'heldShip' );
});

socket.on( 'turn', function()
{
	$( '#gameStatus' ).html( 'It\'s your turn!' );
});

socket.on( 'notTurn', function()
{
	$( '#gameStatus').html( 'It\'s not your turn!' );
});

socket.on( 'won', function()
{
	alert( 'Congratulations... you won!' );
});

socket.on( 'lost', function()
{
	alert( 'Aw... you lost :(' )
});

$( document ).ready( function()
{
	var selectedSize = 0;
	var left = false;
	var shipReady = false;
	var coords = "";
	var board = [];

	$( document ).keypress( function( event )
	{
		if ( event.which == 13 && shipReady ) {
			AddOrRemoveShips( coords[0], coords[1], true, "hoverShip" );
			AddOrRemoveShips( coords[0], coords[1], false, "heldShip" );

			var sizeSelection = $( '#ship-place-' + selectedSize + " span" );
			sizeSelection.html( parseInt( sizeSelection.html() ) - 1 );
			if( sizeSelection.html() == "0" )
			{
				selectedSize = 0;
				sizeSelection.parent().remove();
			}
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
		socket.emit( 'shoot', { id : $( this ).attr( 'id' ), user : id } );
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
		$( '.hoverShip').each( function()
		{
			$( this ).removeClass( 'hoverShip' );
		});
		$( '.errorShip').each( function()
		{
			$( this ).removeClass( 'errorShip' );
		});

		var toPost = new Array();
		var canShipBePlaced = true;
		for( var i = 0; i < selectedSize; i++ )
		{
			var element, x, y;
			if( !left )
			{
				x = parseInt( startX ) + i;
				y = parseInt( startY );
				element = $( '#y' + x + "-" + y );
			}
			else
			{
				x = parseInt( startX );
				y = ( parseInt( startY ) + i );
				element = $( '#y' + x + "-" + y );
			}

			if( canShipBePlaced && !CanShipBePlaced( x, y ) )
			{
				canShipBePlaced = false;
				$( '.hoverShip' ).addClass( 'errorShip' );
				$( '.hoverShip' ).removeClass( 'hoverShip' );
				className += " errorShip";
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
				if( canShipBePlaced )
				{
					toPost.push( x + "-" + y );
					board.push( { 'x' : x, 'y' : y } );
				}
			}
		}

		if( toPost.length != 0 )
		{
			socket.emit( 'logShip', { entry : toPost, id : id });
		}
	}

	function CanShipBePlaced( x, y )
	{
		var occupied = false;
		for( var i = 0; i < board.length; i++ )
		{
			if( board[ i ].x == x && board[ i ].y == y )
			{
				occupied = true;
				break;
			}
		}
		return ( x < 10 && y < 10 ) || occupied;
	}
});

window.onbeforeunload = function( e )
{
	socket.emit( 'quit', { 'id' : id } )
};