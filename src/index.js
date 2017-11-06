import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Buttons from './teste';

class Box extends React.Component {
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col)
    }
    
    render(){
        return(
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox} 
            />
        );
    }
}

class Grid extends React.Component {
    render(){

        const width = this.props.cols * 14;
        var rowsArr = [];

        var boxClass = "";
        for(var i=0; i<this.props.rows; i++){
            for(var j=0;j<this.props.cols; j++){
                let boxId = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        row={i}
                        col={j}
                        selectBox={this.props.selectBox} 
                    />
                );
            }
        }

        return(
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Game extends React.Component {
    
    constructor(){
        super();
        this.speed = 100;
        this.rows = 30;
        this.cols = 50;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
        }
    }

    selectBox = (row,col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })
    }

    seed = () => {
        let gridCopy = arrayClone(this.state.gridFull);
        for(let i=0;i<this.rows;i++){
            for(let j=0; j<this.cols; j++){
                if(Math.floor(Math.random()*5) === 1){ //gera um numero pra ver se vai ser povoado ou nao
                    gridCopy[i][j] = true;
                }
            }
        }
        this.setState({
            gridFull: gridCopy
        })
    }

    playButton=() => {
        clearInterval(this.intervalId);
        this.intervalId = setInterval(this.play, this.speed); //a cada 11 miliseconds o play vai ser chamado
    }

    pauseButton = () => {
        clearInterval(this.intervalId);
        this.speed = 100;
    }

    slow = () =>  {
        this.speed = 1000;
        this.playButton();
    }

    fast = () =>  {
        this.speed = 10;
        this.playButton();
    }

    clear = () => {
        clearInterval(this.intervalId);
        var grid = Array(this.rows).fill().map(()=> Array(this.cols).fill(false));
        this.setState({
            gridFull: grid,
            generation: 0
        });
    }

    gridSize = (size) => {
         switch (size){
             case "1":
                this.cols = 20;
                this.rows = 10;
                break;
            case "2":
                this.cols = 50;
                this.rows = 30;
                break;
            case "3":
                this.cols = 70;
                this.rows = 50;
                break;
            default:
                this.cols = 120;
                this.rows = 100;
                break;
         }
         this.clear();
    }

    play = () => {
        let g = this.state.gridFull;
        let g2 = arrayClone(this.state.gridFull);

        for( let i=0;i<this.rows; i++){
            for(let j=0;j<this.cols; j++){
                let count = 0; //contagem de vizinhos que a celula tem, ela pode ter 8 possíveis vizinhos, entao tem que checar cada posicao a sua volta
                if(i > 0) //verificacao 1
                    if(g[i - 1][j]) 
                        count++;
                if(i > 0 && j > 0)//verificacao 2
                    if(g[i - 1][j - 1])
                        count++;
                if(i > 0 && j < (this.cols - 1)) //verificacao 3
                    if(g[i - 1][j + 1])
                        count++;
                if(j < this.cols-1)//verificacao 4
                    if(g[i][j + 1])
                        count++;
                if(j > 0)//verificacao 5
                    if(g[i][j - 1])
                        count++;
                if(i < this.rows - 1)//verificacao 6
                    if(g[i + 1][j])
                        count++;
                if(i < this.rows - 1 && j > 0) //verificacao 7
                    if(g[i + 1][j - 1])
                        count++;
                if(i < this.rows - 1 && this.cols - 1)//verificacao 8
                    if(g[i+1][j+1])
                        count++;

                if(g[i][j] && (count < 2 || count > 3)) // se esta vivo e tem menos de 2 ou mais de 3, morre
                    g2[i][j] = false;
                if(!g[i][j] && count === 3) // se esta morto e tem 3 vizinhos, fica vivo
                    g2[i][j] = true;
            }
        }
        this.setState({
            gridFull: g2,
            generation: this.state.generation + 1,
        });

    }

    componentDidMount(){ // depois que o componente foi montado
        this.seed(); // planta as sementes aleatoriamente
        this.playButton(); //comeca o jogo
    }
    
    render(){
        return(
            <div>
                <h1>The game of Life</h1>
                <Buttons 
                    playButton={this.playButton}
                    pauseButton={this.pauseButton}
                    slow={this.slow}
                    fast={this.fast}
                    clear={this.clear}
                    seed={this.seed}
                    gridSize={this.gridSize}
                />
                <Grid
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />

                <h2>Generations: {this.state.generation}</h2>
            </div>
        );
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}


ReactDOM.render(<Game />, document.getElementById('root'));
