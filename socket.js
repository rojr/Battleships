var io = require( './socket.io/' ).listen( 1337 );

/*
	Generic user var to create users and make them a bit more functional
 */
var GenericUser = function() {
	this.prototype.id = 0;
	this.prototype.socket = null;
	this.prototype.ready = false;
	this.prototype.map = clearBoard();
	this.prototype.shipBlocks = 0;
};

//ID generated when both players are ready
var turn = 0;
/*
 0 empty
 1 miss hit
 2 ship safe
 3 ship hit
 */
var user1 = new GenericUser;
var user2 = new GenericUser;

function clearBoard()
{
	var temp = new Array( 10 );
	for( var i = 0; i < 10; i++ )
	{
		temp[ i ] = new Array( 10 );
		for( var j = 0; j < 10; j++ )
		{
			temp[ i ][ j ] = 0;
		}
	}
	return temp;
}

io.sockets.on( 'connection', function( socket )
{
	console.log( socket );
	socket.on( 'register', function( data )
	{
		console.log( "New user joined" );
		if( user1.id != 0 )
		{
			user2.id = data.id;
			user2.socket = socket;
		}
		else
		{
			user1.id = data.id;
			user1.socket = socket;
		}

		if( user1.id != 0 && user2.id != 0 )
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
			var user = GetUser( data.id );
			user.map[ split[ 0 ] ][ split[ 1 ] ] = 2;
			user.shipBlocks++;
			if( user.shipBlocks == 30 )
			{
				user.ready = true;
				break;
			}
		}

		console.log( user.map );
	});

	socket.on( 'shoot', function( data )
	{
		console.log( data.id + " shot " );

		SwitchTurn( data.user );

		data.id = data.id.replace( 'e', '' );

		socket.broadcast.emit( 'shoot', data );

		if( PlayerShoot( data.user, data.id ) )
		{
			socket.emit( 'shoot', { type : 'hit', id : "e" + data.id } );
		}
		else
		{
			socket.emit( 'shoot', { type : 'miss', id : "e" + data.id  } )
		}
	});

	socket.on( 'quit', function( data )
	{
		if( data.id == user1 )
		{
			user1 = new GenericUser;
		}
		else
		{
			user2 = new GenericUser;
		}
		console.log( "quit" );
	});
});

function PlayerShoot( player, coordinates )
{
	var exploded = coordinates.split( '-' );
	var x = exploded[ 0], y = exploded[ 1 ];

	var user = GetUser( player );
	switch( user.map[ x ][ y ] )
	{
		case 0:
		case 1:
			user.map[ x ][ y ] = 1;
			return false;
		case 2:
			user.map[ x ][ y ] = 3;
			return true;
		default:
			return true;
	}
}

function GetUser( id )
{
	if( id == user1.id )
	{
		return user1;
	}
	else
	{
		return user2;
	}
}

function GetOtherUser( $id )
{
	if( id != user1.id )
	{
		return user1;
	}
	else
	{
		return user2;
	}
}

function SwitchTurn( $id )
{
	turn = GetOtherUser( $id ).id;
}