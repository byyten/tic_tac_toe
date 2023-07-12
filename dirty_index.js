/**
 *      Tic Tac Toe
*/



const _board = (() => {
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
const _game = (() => {
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
        let _turn, _plyr;
        console.log('start ' + JSON.stringify(players) + ' '  + _count.is())
        if (players.length !== 2) {
            console.log("Can't play, need two players, set up 2 players and reset board for new game")
            return [undefined, undefined]
        }
        if (_count.is() > 10) {
            console.log(' Game has no more moves, reset game and play again')
            has_winner()
            return [undefined, undefined]
        }
        _turn = _count.is() % 2 == 0 ? 1 : 0; //       players_turn(_count.is()); // determines whose turn it is // returns 0 | 1 which implies/indexes the player array 
        _plyr = players[_turn]; //alternates between players  
        if (!game_over) { _count.add(); } // increments after move
        console.log(['?', _turn, _plyr])
        return [_turn, _plyr]
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
            console.log('game over: ' + game_over)
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
            console.log('has_winner: end ' + game_over)
            return
        } else if (score === -1  && _count.is() >= 10) {
            game_over = true
            console.log('game over: ' + game_over)
            game_result = ' Game is drawn, no winner'
            console.log(game_result)
            board.print()
            console.log('has_winner: end ' + game_over)
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
        _count.reset()
        board.reset()
        board.print()
        game_over = false;
        console.log('game reset: new game' + game_over)

    }
    return {player_add, player_reset, player_alternate, random_move, has_winner, players, board, _count, reset, game_over }
})()

/*
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


    */


    display = (() => {
        let ttt
        let grids
        let game = _game
        // let players
        let btn_player_add 
        let btn_reset_board 
        let btn_players_reset

        config = () => {
            ttt = document.querySelector('table')

            // game.player_add(0, 'ceegee')
            // game.player_add(1, 'peeceeeeee')
            // // game.players  

            grids = ttt.querySelectorAll('div.grid')
            grids.forEach(gr => {
                gr.addEventListener('click', (evt) => {
                    //console.log(evt.target)
                    if (!game.game_over) {
                        grid_click(evt.target.classList[1])
                    }
                })
            })    
            
            inp_player_names = document.querySelectorAll('input.player')
            btn_player_add = document.querySelectorAll('button.addplayer')
            btn_player_add.forEach(btn => btn.addEventListener('click', (evt) => {
                let idx = Number(evt.target.classList[1].split('_')[1])
                player_add(idx)
                evt.target.textContent = 'Change player'
            }))


            btn_players_reset = document.querySelector('button.reset_players')
            btn_players_reset.addEventListener('click', (evt) => {
                players_reset()
            })
            
            btn_reset_board = document.querySelector('button.reset_board')
            btn_reset_board.addEventListener('click', (evt) => {
                display.game.reset()
                display.reset_board()
            })
            
            game.game_over = false;

        }

        grid_click = (_grid) => {
            console.log('game over: ' + _game.game_over)
            if (!_game.game_over) {
                let r, c, _idx, _player, tf
                [r, c] = _grid.split('_').slice(1).map(n => Number(n))
                console.log([r, c])
                console.log([_idx, _player] = _game.player_alternate())
                tf = _game.board.set_move(r, c, _player.value)
                console.log(_idx + ' ' + tf)
                console.log( JSON.stringify(_player))
                grids[display.rc_idx(r, c)].textContent = _player.token
            }

            _game.has_winner()
        }
        rc_idx = (r, c) => r * 3 + c;
        //  grids[rc_idx(2,1)]
        
        reset_board = () => {
            grids.forEach(elem => {
                elem.textContent = ''
            });
        }

        player_add = (idx) => {
            // display.
            game.player_add(idx, _player_get(idx));
        }
        _player_set = (idx, value) => {
            // display.
            inp_player_names[idx].value = value;
        }
        _player_get = (idx) => {
            return inp_player_names[idx].value;
        }
        players_reset = () => {
            inp_player_names.forEach(plyr => plyr.value = '')
            // display.
            game.player_reset()
        }

        return {config, reset_board, grid_click, game, rc_idx, player_add, players_reset, _player_get, _player_set}        
    })()




    display.config()




















    // grid_click = (_grid) => {
    //     console.log(display.game)
        
    //     let r, c, _turn, _plyr
    //     [r, c] = _grid.split('_').slice(1).map(n => Number(n))
    //     console.log([r, c])

    //     [_turn , _plyr] = _game.player_alternate()
    //     display.game.set_move(r, c, _plyr.value)

    //     console.log(_turn)
    //     console.log( JSON.stringify(_plyr))
    //     display.grids[display.rc_idx(r, c)].textContent = _plyr.token
    //     _game.has_winner()
    // }


    // display = disp()

  

            // try {
            //     [_turn , _plyr] = _game.player_alternate()
            //     _game.set_move(r, c, _plyr.value)
            // } catch (err) {
            //     if (_game.players.length !== 2) {
            //         console.log("Can't play, need two players, set up 2 players and reset board for new game")
            //         return [undefined, undefined]
            //     }
            //     if (_game._count.is() > 10) {
            //         console.log(' Game has no more moves, reset game and play again')
            //         _game.has_winner()
            //         return [undefined, undefined]
            //     }
            //     let _turn = _game._count.is() % 2 == 0 ? 1 : 0; //       players_turn(_count.is()); // determines whose turn it is // returns 0 | 1 which implies/indexes the player array 
            //     let _plyr = _game.players[_turn]; //alternates between players  
            //     console.log( _turn, _plyr)
            //     _game.board.set_move(r, c, _plyr.value)
        
            //     if (!_game.game_over) _game._count.add(); // increments after move
            // }