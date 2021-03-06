import React from 'react';
import Rectangle from './Rectangle.jsx';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import InputRange from 'react-input-range'

import {get_animations_insertion_sort} from './InsertionSort.js';
import {get_animations_bubble_sort} from './BubbleSort.js';
import {quick_sort_hoare} from './QuickSortHoare.js';
import {quick_sort_lomuto} from './QuickSortLomuto.js';
import {merge_sort} from './MergeSort.js';

import './SortingVisualizer.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-input-range/lib/css/index.css'

const ARRAY_MIN=5;
const ARRAY_MAX=100;

const MAX_SIZE_DISPLAY_NUM = 25;

const BASE_COLOR="turquoise";
const WRONG_COLOR="red";
const CORRECT_COLOR="green";
const PIVOT_COLOR="orange";

export default class SortingVisualizer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            array : [13, 75, 14, 23, 9, 32, 8, 66, 34, 93],
            color : [],
            speed : 0.011,
            array_size : 10,
            sorting : false
        }
      }
    
    componentDidMount() {
        this.handleGeneration(this.state.array_size, ARRAY_MIN, ARRAY_MAX);
        this.setState({array:[13, 75, 14, 23, 9, 32, 8, 66, 34, 93]})
    }

    render(){
        return (
        <Container fluid={true} className="fullSizeContainer">
            <Navbar bg="light" expand="lg">
            <Navbar.Brand>Sorting Visualizer</Navbar.Brand>
            {this.state.sorting ? <Button id="stopButton" variant="danger" onClick={() => this.handleStop()}>Stop</Button> : null}

            <Nav className="mx-auto">
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleGeneration(this.state.array_size, ARRAY_MIN, ARRAY_MAX)}
                        disabled={this.state.sorting}>Generate new array</Button>
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleInsertionSort()}
                        disabled={this.state.sorting}>Insertion Sort</Button>
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleBubbleSort()}
                        disabled={this.state.sorting}>Bubble Sort</Button>
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleQuickSortLomuto()}
                        disabled={this.state.sorting}>Quick Sort (Lomuto)</Button>
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleQuickSortHoare()}
                        disabled={this.state.sorting}>Quick Sort (Hoare)</Button>
                <Button className="mx-1 text-nowrap" 
                        onClick={() => this.handleMergeSort()}
                        disabled={this.state.sorting}>Merge Sort</Button>

            </Nav>
            </Navbar>
            <Container style={{width: '50vw', height: '10vh' }}>
                <Row>
                    <Col>Array Size
                        <InputRange
                        formatLabel={value => `${value}`}
                        step={10}
                        maxValue={200}
                        minValue={10}
                        value={this.state.array_size}
                        disabled={this.state.sorting}
                        onChange={(array_size) => {this.handleArraySizeChange(array_size);}} />
                    </Col>
                    <Col>Speed
                        <InputRange
                        formatLabel={value => `${value}`}
                        step={1}
                        maxValue={10}
                        minValue={0}
                        value={500*this.state.speed-0.5}
                        disabled={this.state.sorting}
                        onChange={value => this.setState({ speed : (2*value+1)/1000 })} />
                    </Col>
                </Row>
                    
                    
                    
            </Container>
            <Container className="d-flex mx-auto" style={{ background: '#9e9e9e', width: '80vw', height: '80vh' }}>
                {this.state.array.map((number,idx) =>
                        (<Rectangle key={idx} array_size={this.state.array_size} color={this.state.color[idx]} height={Math.round(100*number/ARRAY_MAX)} 
                        width={100/this.state.array_size} value={this.state.array_size<=MAX_SIZE_DISPLAY_NUM ? number : ""}></Rectangle>)
                )}
            </Container>                

        </Container>
            )
    }
    
    handleGeneration(len, min, max) {
        var array = [];
        for (var i = 0; i<len; i++){
            array.push(Math.round(ARRAY_MIN + (ARRAY_MAX-ARRAY_MIN)*Math.random()))
        }
        var color = array.map(number => BASE_COLOR);
        this.setState({array: array, color: color});
    }

    handleArraySizeChange(size){
        this.setState({ array_size:size });
        this.handleGeneration(size, ARRAY_MIN, ARRAY_MAX);
    }

    changeColor(idx_arr, color){
        var current_color = this.state.color.slice();
        idx_arr.forEach(function(idx, c=0){current_color[idx] = color[c++]});
        this.setState({color: current_color});
    }

    resetColor(){
        var current_color = this.state.color.slice();
        this.setState({color: current_color.map(c => BASE_COLOR)});
    }

    swapValues(i, j){
        var current_array = this.state.array.slice();
        var tmp = current_array[i];
        current_array[i] = current_array[j];
        current_array[j] = tmp;
        this.setState({array: current_array});
    }

    handleInsertionSort(){
        this.setState({sorting: true});
        this.resetColor();

        var current_array = this.state.array.slice();
        var animations = get_animations_insertion_sort(current_array);
        var last_p, last_min_idx, last_j;

        for (var k = 0; k<animations.length; k++){
            var [p, min_idx, j, status] = animations[k];

            //If pivot changes
            if (p!==last_p){
                setTimeout(
                    function (p, last_p){
                        this.resetColor();
                        this.changeColor([p, last_p], [PIVOT_COLOR, BASE_COLOR]);
                    }.bind(this, p, last_p),
                    k/this.state.speed
                )
            }

            //If min_idx changes
            if (last_min_idx!== min_idx && last_min_idx!==p){
                setTimeout(
                    function (last_min_idx){
                        this.changeColor([last_min_idx], [BASE_COLOR]);
                    }.bind(this, last_min_idx),
                    (k+1)/this.state.speed
                );
            }

            //If comparison
            if (!status){
                setTimeout(
                    function(last_j, j, min_idx){
                        if (last_j===min_idx){
                            this.changeColor([last_j, j], [PIVOT_COLOR, CORRECT_COLOR]);
                        } else {
                            this.changeColor([last_j, j], [BASE_COLOR, CORRECT_COLOR]);
                        }
                    }.bind(this, last_j, j, min_idx),
                    (k+1/3)/this.state.speed
                );

            } else {    //If swapping

                if (p!==min_idx){    // do swap only if useful
                    setTimeout(
                        function(p, min_idx){
                            this.changeColor([p, min_idx], [WRONG_COLOR, WRONG_COLOR]);
                            this.swapValues(p, min_idx);
                        }.bind(this, p, min_idx, status),
                        (k+2/3)/this.state.speed
                    )
                }
            }
            last_p=p;
            last_j=j;
            last_min_idx=min_idx;
        }

        setTimeout(
            function(){
                this.resetColor();
                this.setState({sorting: false});
            }.bind(this),
            animations.length/this.state.speed
        );
    }

    handleBubbleSort(){
        this.setState({sorting: true});
        this.resetColor();

        var current_array = this.state.array.slice();
        var animations = get_animations_bubble_sort(current_array);
        for (var k = 0; k<animations.length; k++){
            var [i,j,toswap] = animations[k];
            setTimeout(
                function (i,j,toswap){
                    this.changeColor([i,j], toswap ? [WRONG_COLOR,WRONG_COLOR] : [CORRECT_COLOR,CORRECT_COLOR]);
                }.bind(this, i, j, toswap),
                k/this.state.speed
            )
            if (toswap){
                setTimeout(
                    function (i,j){
                        this.swapValues(i,j)
                    }.bind(this, i, j), (k+1/3)/this.state.speed
                )
            }
            setTimeout(
                function (i,j){
                    this.changeColor([i,j], [BASE_COLOR, BASE_COLOR]);
                }.bind(this, i, j), (k+2/3)/this.state.speed
            )
        }

        setTimeout(
            function(){
                this.setState({sorting: false});
            }.bind(this),
            animations.length/this.state.speed
        );

    }

    handleQuickSortHoare(){
        this.setState({sorting: true});
        this.resetColor();

        var current_array = this.state.array.slice();
        var animations = [];
        [current_array, animations] = quick_sort_hoare(current_array, 0, current_array.length-1, animations);
        var last_p, last_i, last_j = -1
        for (var k = 0; k<animations.length; k++){
            var [p,i,j,toswap] = animations[k];
            setTimeout(
                function(p, last_p){
                    if (p!==last_p){
                        this.changeColor([last_p, p], [BASE_COLOR,PIVOT_COLOR]);
                    }
                }.bind(this, p, last_p),
                k/this.state.speed
            )
            setTimeout(
                function (current_array, last_i, last_j, i, j, last_p, p, toswap){
                    if (last_i===last_p && last_p===p){
                        this.changeColor([last_i, last_j], [PIVOT_COLOR, BASE_COLOR]);
                    } else if (last_j===last_p && last_p===p){
                        this.changeColor([last_i, last_j], [BASE_COLOR, PIVOT_COLOR]);
                    } else {
                        this.changeColor([last_i, last_j], [BASE_COLOR, BASE_COLOR]);
                    }
                    this.changeColor([i,j], (toswap && current_array[i]!==current_array[j]) ? //Hoare quick sort does useless swaps
                                                                                             // when values are the same, CORRECT_COL wanted
                                            [WRONG_COLOR,WRONG_COLOR] : [CORRECT_COLOR,CORRECT_COLOR]);
                }.bind(this, current_array, last_i, last_j, i, j, last_p, p, toswap),
                k/this.state.speed
            )
            if (toswap){
                setTimeout(
                    function (i,j){
                        this.swapValues(i,j)
                    }.bind(this, i, j), (k+1/2)/this.state.speed
                )
            }
            last_i=i;
            last_j=j;
            last_p=p;
        }
        setTimeout(
            function(){
                this.setState({color : current_array.map(number => 'turquoise')});
                this.setState({sorting: false});
            }.bind(this),
            animations.length/this.state.speed
        );
        
    }

    handleQuickSortLomuto(){
        this.setState({sorting: true});
        this.resetColor();
        
        var current_array = this.state.array.slice();
        var animations = [];
        quick_sort_lomuto(current_array, 0, current_array.length-1, animations);
        var last_p, last_i, last_j;
        for (var k=0; k<animations.length;k++){
            var [p,i,j,toswap] = animations[k];

            setTimeout(
                function(p, last_p){
                    if (p!==last_p){
                        this.changeColor([last_p, p], [BASE_COLOR,PIVOT_COLOR]);
                    }
                }.bind(this, p, last_p),
                k/this.state.speed
            );
            
            if (i!==j){
                setTimeout(
                    function(last_i, last_j, i,j,toswap){
                        if (toswap){
                            this.changeColor([last_i, last_j, i,j], [BASE_COLOR, BASE_COLOR, CORRECT_COLOR, WRONG_COLOR]);
                        } else {
                            this.changeColor([last_i, last_j, i,j], [BASE_COLOR, BASE_COLOR, CORRECT_COLOR, CORRECT_COLOR]);
                        }
                    }.bind(this, last_i, last_j, i, j, toswap),
                    (k+1/3)/this.state.speed
                );
    
                setTimeout(
                    function(i,j,toswap){
                        if (toswap){
                            this.swapValues(i,j);
                        }
                    }.bind(this, i, j, toswap),
                    (k+2/3)/this.state.speed
                );
            } else {
                setTimeout(
                    function(last_i, last_j, i){
                        this.changeColor([last_i, last_j, i], [BASE_COLOR, BASE_COLOR, CORRECT_COLOR]);
                    }.bind(this, last_i, last_j, i),
                    (k+1/2)/this.state.speed
                );
            }

            last_p=p;
            last_i=i;
            last_j=j;

        }
        setTimeout(
            function(last_i, last_j){
                this.changeColor([last_i, last_j], [BASE_COLOR, BASE_COLOR]);
                this.setState({sorting: false});
            }.bind(this, last_i, last_j),
            animations.length/this.state.speed
        );

    }

    handleMergeSort(){
        this.setState({sorting: true});
        this.resetColor();

        var current_array = this.state.array.slice();
        var animations = [];
        merge_sort(current_array, 0, this.state.array_size-1, animations);
        for (var k = 0; k<animations.length; k++){
            var [i,j,toswap] = animations[k];
            setTimeout(
                function (i,j,toswap){
                    this.changeColor([i,j], toswap ? [WRONG_COLOR,WRONG_COLOR] : [CORRECT_COLOR,CORRECT_COLOR]);
                }.bind(this, i, j, toswap),
                k/this.state.speed
            )
            if (toswap){
                setTimeout(
                    function (i,j){
                        this.changeColor([i,j,i+1], [WRONG_COLOR, BASE_COLOR, WRONG_COLOR]); //Order is important: j could be i+1
                        this.moveJ2I(i,j);
                    }.bind(this, i, j), (k+1/3)/this.state.speed
                )
            }
            setTimeout(
                function (i){
                    this.changeColor([i,i+1], [BASE_COLOR, BASE_COLOR]);
                }.bind(this, i), (k+2/3)/this.state.speed
            )
        }

        setTimeout(
            function(){
                this.setState({sorting: false});
            }.bind(this),
            animations.length/this.state.speed
        );
    }

    moveJ2I(i, j){
        var current_array = this.state.array.slice();
        var tmp = current_array[j];
        current_array.splice(j, 1);
        current_array.splice(i, 0, tmp);
        this.setState({array: current_array});
    }

    handleStop(){
        var highestTimeoutId = setTimeout(";");
        for (var i = 0 ; i < highestTimeoutId ; i++) {
            clearTimeout(i); 
        }
        this.setState({sorting: false});
    }
}