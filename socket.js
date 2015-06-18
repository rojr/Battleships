var io = require( './socket.io/' ).listen( 1337 );

var user1 = {
	id : 0,
	ready : false
};
var user2 = {
	id : 0,
	ready : false
};

/*

	0 empty
	1 miss hit
	2 ship safe
	3 ship hit

 */
var board1 = [10][10];
var board2 = [10][10];

io.sockets.on( 'connection', function( socket )
{
	socket.on( 'register', function( data )
	{
		console.log( data.id );
		if( user1 != 0 )
		{
			user2.id = data.id;
		}
		else
		{
			user1.id = data.id;
		}

		if( user1 != 0 && user2 != 0 )
		{
			socket.broadcast.emit( 'ready' );
			socket.emit( 'ready' );
		}
	});

	socket.on( 'logShip', function( data )
	{
		for( var i = 0; i < data.entry.length; i++ )
		{
			var split = data.entry[ i ].split( "-" );
			if( data.id == user1.id )
			{
				board1[ split[0] ][ split[ 1] ] = 2;
			}
			else
			{
				board2[ split[0] ][ split[ 1] ] = 2;
			}
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