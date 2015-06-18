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

	$( '.click-cell' ).click( function()
	{
		socket.emit( 'shoot', { id : $( this ).attr( 'id' ) } );
		$( this ).css( 'background-color' , 'red' );
	});

	$( '.personal-ships' ).hover( function()
	{
		var coords = $( this ).attr( 'id').replace( 'y', '' ).split( '-' );
		AddOrRemoveShips( coords[0], coords[1], false, selectedSize, false, "hoverShip" );
	},
	function()
	{
		var coords = $( this ).attr( 'id').replace( 'y', '' ).split( '-' );
		AddOrRemoveShips( coords[0], coords[1], false, selectedSize, true, "hoverShip" );
	});

	$( '.ships' ).click( function()
	{
		selectedSize = parseInt( $( this ).attr( 'size' ) );
	});

	function AddOrRemoveShips( startX, startY, left, size, remove, className )
	{
		for( var i = 0; i < size; i++ )
		{
			var element;
			if( left )
			{
				element = $( '#y' + ( parseInt( startX ) + i ) + "-" + startY );
			}
			else
			{
				element = $( '#y' + startX + "-" + ( parseInt( startY ) + i ) );
			}

			if( element.length == 0 ) return;

			if( remove )
			{
				element.removeClass( className );
			}
			else
			{
				element.addClass( className );
			}
		}
	}
});

window.onbeforeunload = function( e )
{
	socket.emit( 'quit', { 'id' : id } )
};