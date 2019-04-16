/*
Joao Lemos' challenge 15/04/19

Code

The code above was desgined to provide a chart as requested in the challenge

The main part of the code is on the function handleClick, it receives the input data (using states), processes it, and update the states which are input to update the chart.

As the application is not very large and it uses some imported components, the code was not splitted in several components.

Some kind of errors were shown as logs and not as alerts or other kind of display.


Assumptions

For simplicity, it was assumed that the data would come in chronological order, but in a more real situation, it is recommended to consider that the data can come in any order. And even in chronological order, when events have the same timestamp, it was assumed that they would follow the priority: start, span, stop and data.

Each line of the input data was considered to be a different event.


Libraries

Selected Libraries: Create React App, React, Material-UI, Recharts, React-Splitter-Layout, React-Monaco-Editor

Unselected libraries (the following libraries were tested but not selected to build the application): React-split-pane (layout), React-resizable (layout), React split (layout), React-d3-components (charts), ReactAce (code editor).


Large amount of data

To protect the application against large amounts of data, it was considered (but not implemented) the following option:

- Limit the quantity of points used on the graph: perhaps the input generates more data than it is necessary, and it can be treated with a moving average of some points, turning a large amount of data in the input, in a smaller amount of data in the output. Or another solution is to work with a defined range of events or points, and when new events arrive, the oldest ones can be discarded from the analysis.

- The speed of the application: if there are a large amount of data to be processed, turning the chart's update irregular, then, it can be changed the frequency of chart's updating, turning the application more flexible.


*/

import React, { Component } from 'react'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'

import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';

import { XAxis, YAxis, Tooltip, CartesianGrid, Legend, ScatterChart, ZAxis, Scatter } from 'recharts';

import MonacoEditor from 'react-monaco-editor';

import './App.css'

class App extends Component {
    
    constructor(props){
        
        const data_input="{type: 'start', timestamp: 1519862400000, select:['min_response_time', 'max_response_time'], group:['os', 'browser']}\n{type: 'span', timestamp: 1519862400000, begin: 1519862400000, end: 151198624600000}\n{type: 'data', timestamp: 1519862400000, os: 'linux', browser:'chrome', min_response_time:0.1, max_response_time: 1.3}\n{type: 'data', timestamp: 1519862400000, os: 'mac', browser:'chrome', min_response_time:0.2, max_response_time: 1.2}\n{type: 'data', timestamp: 1519862400000, os: 'mac', browser:'firefox', min_response_time:0.3, max_response_time: 1.2}\n{type: 'data', timestamp: 1519862400000, os: 'linux', browser:'firefox', min_response_time:0.1, max_response_time: 1.0}\n{type: 'data', timestamp: 1519862460000, os: 'linux', browser:'chrome', min_response_time:0.2, max_response_time: 0.9}\n{type: 'data', timestamp: 1519862460000, os: 'mac', browser:'chrome', min_response_time:0.1, max_response_time: 1.0}\n{type: 'data', timestamp: 1519862460000, os: 'mac', browser:'firefox', min_response_time:0.2, max_response_time: 1.1}\n{type: 'data', timestamp: 1519862460000, os: 'linux', browser:'firefox', min_response_time:0.3, max_response_time: 1.4}"
        
        super(props)
        this.state={
            width: 300,
            height: 300,
            data_input: data_input,
            select: [],
            group: [],
            data_output2: [],
            span: undefined,
        }
        this.handleClick = this.handleClick.bind(this)
        this.fitToParentSize = this.fitToParentSize.bind(this)
    }
    
    componentDidMount(){ // Used to turn the chart responsive
        window.addEventListener('resize', this.fitToParentSize)
        this.fitToParentSize()
    }  // Used to turn the chart responsive
    
    componentWillUnmount(){  window.removeEventListener('resize', this.fitToParentSize) }  // Used to turn the chart responsive
    
    handleChange = (newValue) => {  this.setState({ data_input: newValue })     }

    handleClick(){ // Function that processes the events turning them into input to the chart
        
        var start_time, select = [], group = [], i, j, data_group_name, data_group_names, data_output = [], data_group_names2 = [], duration, response_time
        var span = undefined
        var stop = false
        
        const symbols = ["circle","cross","diamond","square","star","triangle","wye"]
        const colors = ['blue', 'green', 'yellow', 'red', 'pink', 'brow', 'black', 'orange']
        
        this.state.data_input.split("\n").forEach( data => { // Divides all the events in single events

            // Adjustments on the input data to be correctly parsed as a JSON

            data = data.replace(/{/g, '{"')
            data = data.replace(/:/g, '":')
            data = data.replace(/, /g, ', "')
            data = data.replace(/'/g, '"')
            data = data.replace(/""/g, '"')
            data = JSON.parse(data) // Parsing the data, watch out for the amount of data parsed, because this function is synchronous
            

            if (data.timestamp === undefined) { console.log("Timestamp wasn't defined") }


            switch(data.type){
            
                case undefined:
                
                    console.log('Undefined - type of the data wasnt defined')
                    break
                
                case "start":
                // Event that defines a new sequence of events
                // Ex.: {type: 'start', timestamp: 1519780251293, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}

                    start_time = Number(data.timestamp)

                    for(i = 0; i < data.group.length; i++){ group.push(data.group[i].toString()) }
                    for(i = 0; i < data.select.length; i++){ select.push(data.select[i].toString()) }
                    stop = false
                    break

                case "span":
                // Defines the boundaries of the chart
                // Ex.: {type: 'span', timestamp: 1519780251293, begin: 1519780251293, end: 1519780260201}

                    if(!stop){
                        const span_begin = Number(data.begin)
                        const span_end = Number(data.end)
                        span = [span_begin - start_time, span_end - start_time]
                    }

                    break
                
                case "stop":
                // Stop the sequence of events
                // Ex.: {type: 'stop', timestamp: 1519780251293}

                    stop = true

                    break

                case "data":
                // Receives data to form the chart
                // Ex.: {type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.3}

                    if(!stop){
                        
                        data_group_name = data[group[0]].charAt(0).toUpperCase() + data[group[0]].slice(1)
                        for ( i = 1; i < group.length; i ++){
                            data_group_name = data_group_name + ' ' + data[group[i]].charAt(0).toUpperCase() + data[group[i]].slice(1)
                        }

                        for (i = 0; i < select.length; i++){
                            data_group_names = data_group_name + ' ' + select[i].charAt(0).toUpperCase() + select[i].slice(1)
                            data_group_names2.push(data_group_names)
                            data.timestamp === undefined ? duration = undefined : duration = data.timestamp - start_time
                            data[select[i]] === undefined ? response_time = undefined : response_time = data[select[i]]
                            data_output.push( // data_output is a array of objects that contains all the usable data from data events
                                {
                                    name: data_group_names,
                                    timestamp: duration,
                                    response_time: response_time,
                                }
                            )
                        }
                    }
                    break
                        
                    default:
                    console.log('Unkown type of event')
                    
            }
            
            let data_group_names3 = [...new Set(data_group_names2)] 
            // data_group_names3 is a array of unique elements made by the composition of group and select elements
            var data_output2 = []
            var data2 = []
            j = 0
            data_group_names3.forEach( groups => {
                j++
                data2=[]
                for (i = 0; i <data_output.length; i++){
                    if (groups === data_output[i].name){
                        if((data_output[i].timestamp !== undefined ) && (data_output[i].response_time !== undefined)){
                            // data2 is a array that contains data for each series in the format of the component used to display the charts
                            data2.push({
                                x: data_output[i].timestamp,
                                y: data_output[i].response_time
                            })
                        }
                    }
                }
                
                data_output2.push(<Scatter key={100+j} name={groups} data={data2} fill={colors[j%colors.length]} line shape={symbols[j%symbols.length]} />)
                // data_output2 is a array of components that reprensents the series to be displayed on the chart
                
            })                

            this.setState({ 
                data_output2: data_output2,
                span: span,
            })
            
        })
                
    }       // Function that updates the chart

    fitToParentSize(){ // Function that turns the chart responsive
        
        var w = this.refs.wrapper.offsetWidth - 20
        var h = this.refs.wrapper.offsetHeight - 20
        
        // Changes the width and sets the minimum width
        if (w!== this.state.width){
            if(w < 300){ w = 300} 
        }
        
        
        // Changes the height and sets the minimum height
        if (h !== this.state.height){
            if(h < 300){ h = 300} 
        }
        
        this.setState({ width: w, height: h})
        
    }   // Function that turns the chart responsive
    
    render(){
            
        return(
            <div>

                <Grid container spacing={0}>
                        

                    <SplitterLayout className={'splitted_pane'} vertical primaryMinSize={100} secondaryMinSize={300} onDragEnd={this.fitToParentSize}>
            
                        <div className={'div_data_input'}>
            
                            {/* Header */}
            
                            <Grid className={'header'} item xs={12}>
                                <Typography className={'name'} variant="h4">
                                    João Lemos&rsquo; Challenge
                                </Typography>
                            </Grid>
            
                        
                            {/* Manual Input */}
            
                            <MonacoEditor height={270} language="javascript" theme="hc-black" value={this.state.data_input} onChange={this.handleChange} />
            
            
                        </div>

            
                        {/* Chart */}
            
                        <div className="chart-wrapper" ref="wrapper">
            
                                <ScatterChart 
                                    width={this.state.width} height={this.state.height} 
                                    margin={{ top: 20, right: 20, bottom: 60, left: 20, }} >
                                    <CartesianGrid />
        
                                    {/* It was chosen to use the conditional rendering to select the boundaries of the chart*/}
                                    {(this.state.span === undefined) &&
                                    <XAxis type="number" dataKey="x" name="Timestamp" unit="ms" type="number"/>
                                    }
            
                                    {(this.state.span !== undefined) && 
                                    <XAxis type="number" dataKey="x" name="Timestamp" unit="ms" type="number" 
                                     allowDataOverflow domain={this.state.span}/>
                                    }
            
                                    <YAxis type="number" dataKey="y" name="Response Time" unit="s" />
                                    <ZAxis type="number" range={[100]} />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Legend />
            
                                    {this.state.data_output2}
                                </ScatterChart>
            
                        </div>
            
                    </SplitterLayout>
            
            
                </Grid>
            
            
                {/*Footer */}
            
                <Grid container className={'footer'} spacing={0}>
                    <Grid item xs={12}>
                        <Button id="btn_chart" variant="contained" color="primary" onClick={this.handleClick}>
                            GENERATE CHART
                        </Button>
                    </Grid>
                </Grid>
                        
            
            </div>
        )
    }
}

export default App