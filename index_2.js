

_board = (() => {
    let _board = [[-9,-9,-9],[-9,-9,-9],[-9,-9,-9]]

    // get row | col | diagonals values
    value_row = (row) => { 
        let ttl = 0;
        let tot;
        return row.reduce((val, tot) => val + tot, ttl);
    }
    value_column = (col) => {
        return value_row( [_board[0][col], _board[1][col], _board[2][col]])
    }
    value_diagonal_down = () => {
        return value_row([_board[0][0], _board[1][1], _board[2][2]])
    }
    value_diagonal_up = () => {
        return value_row([_board[2][0], _board[1][1], _board[0][2]])
    }
    reset = () => {
        _board = [[-9,-9,-9],[-9,-9,-9],[-9,-9,-9]]
    }
    // gets / determines row / col / diagonals values and summarises as 
    // -1 (no winner), 
    // 0 player1 has a row/col/diag and has won, 
    // 1 ditto for player2
    
    score = () => { // was board_value
        let score = -1
        let val;
        for (let n = 0; n < 3; n++) {
            val = value_row(_board[n])
            if (val === 0 || val === 3) {
                score = val
            }
        }
        // score
        for (let n = 0; n < 3; n++) {
            val = value_column(n)
            if (val === 0 || val === 3) {
                score = val
            }    
        }
        val = value_diagonal_down()
        if (val === 0 || val === 3) {
            score = val
        }
        val = value_diagonal_up()
        if (val === 0 || val === 3) {
            score = val
        }
        return score
    }
    symbol = (val) => {
        let sym 
        switch (val) {
            case -9: 
                sym = ' '
                break;
            case 0:
                sym = 'O' // implies player 1
                break;
            case 1:
                sym = 'X' // implies player 2
        }
        return sym
    }
    print = () => {
        let row
        for (let n = 0; n < 3; n++ ) {
            row = `    ${symbol(_board[n][0])}   |   ${symbol(_board[n][1])}   |   ${symbol(_board[n][2])} `
            console.log(row)
            if (n < 2) { console.log(' -------+-------+-------') }
        }
    }
    // checks if a grid is free to choose - called by game_player_move()
    grid_free = (r, c) => {
        if (_board[r][c] < 0) {
            return true
        }
        return false
    }
    set_move = (r, c, v) => {
        if (grid_free(r,c)) {
            _board[r][c] = v
            return true
        }
        return false
    }
    return {reset, score, print, set_move, grid_free }
})()

/* board checks and tests
    board.score()

    board.set_move(0,0,0)
    board.set_move(1,1,0)
    board.set_move(2,2,0)
    board.print()
    board.reset()

*/

// flow
game = (() => {
    let players = []
    let board = _board;
    let game_over = false;
    let _count = (() => {
        // _count = turn_counter(); _count.is(); _count.add()
        let __count = 1;
        function reset() { __count = 1; } 
        function is() {
            return __count;
        }
        function add() {
            return __count++;
        }
        return {is, add, reset}
    })() 
    player_factory = (value, name) => {
        random_choice = () => {
            // [r,c] = game_player_choice()
            r = Math.round(Math.random() * 2000 / 1000)
            c = Math.round(Math.random() * 2000 / 1000)
            return [r, c]
        }
        if (value == 0) {
            return { token: 'O', value: value, name: name, random_choice: random_choice }
        } else if (value == 1) {
            return { token: 'X', value: value, name: name, random_choice: random_choice }
        } else {
            console.log('Two players and only two players can play this game')
            return 
        }
    }
    player_add = (value, name) => {
        if (players.length < 2) {
            let _plyr = player_factory(value, name)
            console.log(players.length + ' ' + _plyr.name)
            players.push(_plyr)
        } else {
            console.log('Only two players can play this game ' + players.length)
        }
    } 
    player_reset = () => {
        players.length = 0
    }
    players_turn = (count) => { // returns player index (0 == plyr1, 1 == plyr2)  
        return count % 2 == 0 ? 1 : 0; 
    }
    player_alternate =() => {
        if (players.length !== 2) {
            console.log("Can't play, need two players, set up 2 players and reset board for new game")
            return [undefined, undefined]
        }
        if (_count.is() > 10) {
            console.log(' Game has no more moves, reset game and play again')
            has_winner()
            return
        }
        let _turn = _count.is() % 2 == 0 ? 1 : 0; //       players_turn(_count.is()); // determines whose turn it is // returns 0 | 1 which implies/indexes the player array 
        let _plyr = players[_turn]; //alternates between players  
        console.log(_plyr, _turn)
        if (!game_over) _count.add(); // increments after move
        return [_turn, _plyr ]
    }
    random_move = (player) => {
        let free = false
        let r, c;
        while (!free && _count.is() <= 10 && !game_over) {
            [r, c] = player.random_choice() // moved to player
            free = board.grid_free(r, c)
            if (free) {
                board.set_move(r, c, player.value); 
            }
            if (_count.is() >= 11 ) {
                game_over = true
                has_winner()
                break;
            }
        }
    }
    has_winner = () => {
        let score = board.score();
        let winner, game_result;
        if (score === 0 || score === 3) { // game has a winner - end of game 
            game_over = true
            if (score === 0) {
                winner = players[0].name 
                game_result = ` Winner is ${players[0].name} in ${_count.is() - 1} moves `
            } else if (score === 3) {
                winner = players[1].name
                game_result = ` Winner is ${players[1].name} in ${_count.is() - 1} moves `
            } else {
                winner = 'draw'
                game_result = ' Game is drawn, no winner'
            }
            console.log(game_result)
            board.print()
            return
        } else if (score === -1  && _count.is() >= 10) {
            // console.log('game is a draw')
            // winner = 'draw'
            game_over = true
            game_result = ' Game is drawn, no winner'
            console.log(game_result)
            board.print()
            return
        } else {
            console.log( 'no winner yet after ' + (_count.is() - 1) + ' moves')
        }
        console.log(game_result)
        board.print()
        console.log('has_winner: end ' + game_over)

        // return { board: score, winner: winner, moves: _count.is() } 
    }
    reset = () => {
        game_over = false;
        _count.reset()
        board.reset()
        board.print()

    }
    return {player_add, player_reset, player_alternate, random_move, has_winner, players, board, _count, reset, game_over }
})()

game.reset()
game.player_add(0, 'ceegee')
game.player_add(1, 'ceegeemee')
game.players.length

game.player_reset()  // not working?**!!!!
game.players.length


    [idx, _plyr]= game.player_alternate()
    game.random_move(game.players[idx])
    game.has_winner()

game.reset()


















/* first skeletal working version

// new game
board_reset = () => {
    return [[-9,-9,-9],[-9,-9,-9],[-9,-9,-9]]
}
// get row | col | diagonals values
value_row = (row) => { 
    let ttl = 0;
    return row.reduce((val, tot) => val + tot, ttl);
}
value_column = (col) => {
     return value_row( [_board[0][col], _board[1][col], _board[2][col]])
}
value_diagonal_down = () => {
    return value_row([_board[0][0], _board[1][1], _board[2][2]])
}
value_diagonal_up = () => {
    return value_row([_board[2][0], _board[1][1], _board[0][2]])
}

// gets / determines row / col / diagonals values and summarises as 
// -1 (no winner), 
// 0 player1 has a row/col/diag and has won, 
// 1 ditto for player2
board_value = () => {
    let score = -1
    for (let n = 0; n < 3; n++) {
        val = value_row(_board[n])
        if (val === 0 || val === 3) {
            score = val
        }
    }
    // score
    for (let n = 0; n < 3; n++) {
        val = value_column(n)
        if (val === 0 || val === 3) {
            score = val
        }    
    }
    val = value_diagonal_down()
    if (val === 0 || val === 3) {
        score = val
    }
    val = value_diagonal_up()
    if (val === 0 || val === 3) {
        score = val
    }
    return score
}
turn_counter = () => {
    // _count = turn_counter(); _count.is(); _count.add()
    let _count = 1;
    function reset() { _count = 1; } 
    function is() {
        return _count;
    }
    function add() {
        return ++_count;
    }
    return {is, add, reset}
}
board_symbol = (val) => {
    let sym 
    switch (val) {
        case -9: 
            sym = ' '
            break;
        case 0:
            sym = 'O'
            break;
        case 1:
            sym = 'X'
    }
    return sym
}
board_print = () => {
    for (let n = 0; n < 3; n++ ) {
        row = `    ${board_symbol(_board[n][0])}   |   ${board_symbol(_board[n][1])}   |   ${board_symbol(_board[n][2])} `
        console.log(row)
        if (n < 2) { console.log(' -------+-------+-------') }
    }
}
game_has_winner = () => {
    let val = board_value();
    let winner;
    if (val !== -1 && _count.is() <= 9) {
        ///console.log(['have a winner', res])
        if (val === 0) {
            winner = 'plyr1'
        } else if (val === 3) {
            winner = 'plyr2'
        }
    } 
    board_print()
    return { board: val, winner, moves: _count.is() } 
}
game_players_turn = (count) => { // returns player index (0 == plyr1, 1 == plyr2)  
    return count % 2 == 0 ? 1 : 0; 
}
// gets a random(ish) choice - called by game_player_move()
game_player_choice = () => {
    // [r,c] = game_player_choice()
    r = Math.round(Math.random() * 2000 / 1000)
    c = Math.round(Math.random() * 2000 / 1000)
    return [r, c]
}
// checks if a grid is free to choose - called by game_player_move()
board_grid_free = (r, c) => {
    if (_board[r][c] < 0) {
        return true
    }
    return false
}
// computer player
game_player_move = () => {
    free = false
    while (!free) {
        [r, c] = game_player_choice()
        free = board_grid_free(r, c)
        if (free) _board[r][c] = _plyr.value;
        // board_print()
    }
}

select_player = () => {
    _turn =  game_players_turn(_count.is()); // determines whose turn it is
    _plyr = _plyrs[_turn]; //alternates between players  
    return [_turn, _plyr] 
}


user_turn = (r,c) => {
    _board[r][c] = 0
}


game_result = (res) => {
    if (res.board === 0 || res.board === 3 && winner !== undefined) {
        console.log('   ')
        console.log(` The winner in ${res.moves} is ${res.winner}`)
        console.log('   ')
        board_print()
    } else if (res.moves > 9 && res.board == -1) {
        console.log('   ')
        console.log( 'Game ends drawn ')
        console.log('   ')
    }
}

player_alternate =() => {
    _count.add(); // increments after move
    [_turn, _plyr ] = select_player()
    return [_turn, _plyr ]
}

game_status = () => {
    return game_has_winner()
}

player_factory = (name) => {
    if (_plyrs.length == 0) {
        return { token: 'O', value: 0, name: name }
    } else if (_plyrs.length == 1) {
        return { token: 'X', value: 1, name: name }
    } else {
        console.log('Two players and only two players can play this game')
        return 
    }
}
player_reset = () => {
    _plyrs = []

}

tictactoe = () => {
    _plyrs = []
    _board = board_reset()
    _plyrs = [{ token: 'O', value: 0, name: 'plyr1' },{ token: 'X', value: 1, name: 'plyr2' }]
    _count = turn_counter(); // sets counter 0


    select_player, game_result, player_alternate, game_player_move, user_turn, board_reset



// game start
    [_turn, _plyr ] = select_player()
    user_turn(1,1)

// logically game proceeds until res.baord === 0 || 3    
    while (res.board == -1) {
            // inter player actions
            res = game_status() // determine board scores
            game_result(res)    // declare a winner or not if any

        [turn, _plyr] = player_alternate()
        game_player_move()

            // inter player actions
            res = game_status() // determine board scores
            game_result(res)    // declare a winner or not if any

        [turn, _plyr] = player_alternate()
        user_turn(2,0)

    }







}
 */

    // [_turn, _plyr ] = select_player()
    // _turn =  game_players_turn(_count.is()); // determines whose turn it is
    // _plyr = _plyrs[_turn]; //alternates between players  

/* 
const personFactory = (name, age) => {
  const sayHello = () => console.log('hello!');
  return { name, age, sayHello };
};


playerFactory = (name, token, value ) => {
    let count = 0;
    const players = []


    return 
}










_board[1][1] = 0
        _count.add() // increments after move
        res = game_has_winner()
    _board[0][1] = 0
        _count.add() // increments after move
        res = game_has_winner()
    _board[2][1] = 0
        _count.add() // increments after move
        res = game_has_winner()
    _board[0][2] = 0
        _count.add() // increments after move
        res = game_has_winner()

        */
    // make a choice, check if grid taken else mark grid and proceed
        // _turn =  game_players_turn(_count.is()); // determines whose turn it is
        // _plyr = _plyrs[_turn]; //alternates between players  
        // [_turn, _plyr ] = select_player()







