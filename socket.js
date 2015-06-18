var io = require( './socket.io/' ).listen( 1337 );

var user1 = 0;
var user2 = 0;

var board = [10][10];

io.sockets.on( 'connection', function( socket )
{
	socket.on( 'register', function( data )
	{
		console.log( data.id );
		if( user1 != 0 )
		{
			user2 = data.id;
		}
		else
		{
			user1 = data.id;
		}

		if( user1 != 0 && user2 != 0 )
		{
			socket.broadcast.emit( 'ready' );
			socket.emit( 'ready' );
		}
	});

	socket.on( 'shoot', function( data )
	{
		console.log( data.id );
		socket.broadcast.emit( 'shoot', data );
	});

	socket.on( 'quit', function( data )
	{
		if( data.id == user1 )
		{
			user1 = 0;
		}
		else
		{
			user2 = 0;
		}
		console.log( "quit" );
	});

	console.log( "works" );
})