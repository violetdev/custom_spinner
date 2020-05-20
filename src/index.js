import React from 'react';
import ReactDOM from 'react-dom';
import {injectStyle, deleteStyle} from './injectStyle.js';
import './index.css';

class Spinner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textbox_array: Array(0),
            //position: Array(0),
            cur_image: 1,
            roll_animation_state: "pre_roll",
            returning_num: 0,
            shuffle_array: [...Array(0).keys()],
            timeout_set: false,
        };
        this.handle_textbox_change = this.handle_textbox_change.bind(this)  
    }

    handleClick_add_textbox() {
        const textbox_array = this.state.textbox_array.slice()
        this.setState({
            textbox_array: textbox_array.concat([textbox_array.length + 1]),
        });
    }

    handleClick_remove_textbox() {
        const textbox_array = this.state.textbox_array.slice(0, this.state.textbox_array.length - 1)
        this.setState({
            textbox_array: textbox_array,
            [textbox_array.length]: "",
        });
    }
    
    transitioning_roll_states() {
        if (this.state.roll_animation_state === "pending") {
            setTimeout(() => {
                this.setState({
                    roll_animation_state: "returning",
                    timeout_set: false,
                })
            }, this.state.textbox_array.length * 500)
        } else if (this.state.roll_animation_state === "returning") {
            setTimeout(() => {
                this.setState({
                    roll_animation_state: "finish",
                    timeout_set: false,
                })
            }, this.state.textbox_array.length * 400)
        } else if (this.state.roll_animation_state === "finish") {    
            setTimeout(() => {
                this.setState({
                    roll_animation_state: "pre_roll",
                    timeout_set: false,
                })
            }, 5000)
        }
    }

    handleClick_animate_roll() {
        this.setState({
            roll_animation_state: "pending",
        });
        this.roll_pick();
        let set_timer = setInterval(() => {
            this.setState({
                    cur_image: (this.state.cur_image) % 60 + 1,
            });
            if (this.state.cur_image === 60) {
                clearInterval(set_timer)
            } else if (this.state.cur_image === 40 && this.state.roll_animation_state !== "finish") {
                this.setState({
                    cur_image: 25,
                });
            }
        }, 50)
    }

    roll_pick() {
        var arr_len = this.state.textbox_array.length, store, rand_ele;
        var shuffle_array = [...Array(arr_len).keys()]
        console.log(arr_len,shuffle_array)
        while (arr_len) {
            rand_ele = Math.floor(Math.random() * arr_len--);
            store = shuffle_array[arr_len];
            shuffle_array[arr_len] = shuffle_array[rand_ele];
            shuffle_array[rand_ele] = store;
        }
        this.setState({
            returning_num: Math.floor(Math.random() * this.state.textbox_array.length),
            shuffle_array: shuffle_array
        });
    }

    handle_textbox_change(event) {
        const name = event.target.name
        this.setState({
            [name]: event.target.value
        });
    }

    refCallback = element => {
        //console.log(element.getBoundingClientRect());
        if (element) {
            //const position = element.id
            this.setState({
                //[position + "_position"]: element.getBoundingClientRect(),
            });
        }
    }

    render() {
        const textbox_array = this.state.textbox_array;
        const image_animation = this.state.roll_animation_state !== "pre_roll" ? <img className = "dust" src = {require("./img/" + this.state.cur_image + ".png")} alt = "cannot display" /> : <img alt = '' />;
        const moves = textbox_array.map((step, move) => {
            return (
                <li key = {move}>
                    <input type = "text" className = "textbox" name = {move} onChange = {this.handle_textbox_change}>
                    </input>
                </li>
            )
        })
        console.log(this.state)
        const circle = textbox_array.map((step, move) => {
            const angle = move * 360 / textbox_array.length;
            const keyframesStyle = `
            @-webkit-keyframes pulse_` + move + ` {
                0%   { transform: }
                
                100%  { transform: rotate(` + angle + `deg) rotate(-` + angle + `deg) rotateY(180deg)}
            }`;
            deleteStyle(keyframesStyle);
            injectStyle(keyframesStyle);

            const return_style = `
            @-webkit-keyframes pulse2_` + move + ` {
                0%   { transform: rotate(` + angle + `deg) }
                100%  { transform: rotate(` + angle + `deg) translate(350%) rotate(-` + angle + `deg)}
            }`;
            deleteStyle(return_style);
            injectStyle(return_style);

            if (this.state.roll_animation_state === "pending") {
                var divStyle = {
                    top: "45%",
                    left: "45%",
                    position: "absolute",
                    backgroundColor: "lightgreen",
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    transform: "rotate(" + angle + "deg) translate(350%) rotate(-" + angle + "deg)",
                    animation: "pulse_" + move + " 0.5s",
                    animationDelay: move/5 + "s",
                    animationFillMode: "forwards",
                    lineHeight: "550%",
                    textAlign: "center",
                }
            } else if (this.state.roll_animation_state === "returning" || this.state.roll_animation_state === "finish") {
                if (move !== this.state.returning_num) {
                    var divStyle = {
                        top: "45%",
                        left: "45%",
                        position: "absolute",
                        backgroundColor: "grey",
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        animation: "pulse2_" + move + " 0.3s",
                        animationDelay: this.state.shuffle_array[move]/2 + "s",
                        animationFillMode: "both",
                        lineHeight: "550%",
                        textAlign: "center",
                    }
                } else {
                    var divStyle = {
                        top: "45%",
                        left: "45%",
                        position: "absolute",  
                        backgroundColor: "lightblue",
                        borderRadius: "50%",
                        width: "100px",
                        height: "100px",
                        lineHeight: "550%",
                        textAlign: "center",
                    }
                }
            } else {
                var divStyle = {
                    top: "45%",
                    left: "45%",
                    position: "absolute",
                    backgroundColor: "lightgreen",
                    borderRadius: "50%",
                    width: "100px",
                    height: "100px",
                    transform: "rotate(" + angle + "deg) translate(350%) rotate(-" + angle + "deg)",
                    lineHeight: "550%",
                    textAlign: "center",
                }
            }

            return (
                <div ref = {this.refCallback} id = {move} className = "tick" style = {divStyle} >{this.state[move]}</div>
            )
        })
        if (!this.state.timeout_set && this.state.roll_animation_state !== "pre_roll") {
            this.setState({
                timeout_set: true,
            })
            this.transitioning_roll_states();
        }

        let status;
        status = 'Number of Events: ' + textbox_array.length;

        return (
        <div className="button_wrap">
            <div className = "data_edit">
                <button
                    className = "add_textbox_button"
                    onClick = {() => this.handleClick_add_textbox()}>
                {"+"}
                </button>
                <button
                    className = "remove_textbox_button"
                    onClick = {() => this.handleClick_remove_textbox()}>
                {"-"}
                </button>
                <text className = "num_events">{status}</text>
                <div>{moves}</div>
                <button
                    className = "go_button"
                    onClick = {() => this.handleClick_animate_roll()}>
                {"GO"}
                </button>
            </div>

            <div className = "circle_events">
                {image_animation}
                {circle}
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Spinner />,
    document.getElementById('root')
);