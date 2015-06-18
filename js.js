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
	$( '.click-cell' ).click( function()
	{
		socket.emit( 'shoot', { id : $( this ).attr( 'id' ) } );
		$( this ).css( 'background-color' , 'red' );
	});
});

window.onbeforeunload = function( e )
{
	socket.emit( 'quit', { 'id' : id } )
};