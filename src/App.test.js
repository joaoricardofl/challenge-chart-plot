import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { mount, shallow } from 'enzyme'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//it('renders without crashing', () => {
//    shallow(<App />)
//})

it('returns the array of input for the chart', () => {
    const wrapper = shalow(<App />)
    const ChartButton = wrapper.find('#btn_chart');
    console.log(ChartButton.debug())
    ChartButton.simulate('click')
    

    wrapper.unmount
})

/*
[{name: "Linux Chrome Min_response_time", uv: 0, pv: 0.1},
{name: "Linux Chrome Max_response_time", uv: 0, pv: 1.3},
{name: "Mac Chrome Min_response_time", uv: 0, pv: 0.2},
{name: "Mac Chrome Max_response_time", uv: 0, pv: 1.2},
{name: "Mac Firefox Min_response_time", uv: 0, pv: 0.3},
{name: "Mac Firefox Max_response_time", uv: 0, pv: 1.2},
{name: "Linux Firefox Min_response_time", uv: 0, pv: 0.1},
{name: "Linux Firefox Max_response_time", uv: 0, pv: 1},
{name: "Linux Chrome Min_response_time", uv: 60000, pv: 0.2},
{name: "Linux Chrome Max_response_time", uv: 60000, pv: 0.9},
{name: "Mac Chrome Min_response_time", uv: 60000, pv: 0.1},
{name: "Mac Chrome Max_response_time", uv: 60000, pv: 1},
{name: "Mac Firefox Min_response_time", uv: 60000, pv: 0.2},
{name: "Mac Firefox Max_response_time", uv: 60000, pv: 1.1},
{name: "Linux Firefox Min_response_time", uv: 60000, pv: 0.3},
{name: "Linux Firefox Max_response_time", uv: 60000, pv: 1.4}]

    expect(wrapper.state().data_output).toEqual(
        [{name: "Linux Chrome Min_response_time", uv: 0, pv: 0.1},
        {name: "Linux Chrome Max_response_time", uv: 0, pv: 1.3},
        {name: "Mac Chrome Min_response_time", uv: 0, pv: 0.2},
        {name: "Mac Chrome Max_response_time", uv: 0, pv: 1.2},
        {name: "Mac Firefox Min_response_time", uv: 0, pv: 0.3},
        {name: "Mac Firefox Max_response_time", uv: 0, pv: 1.2},
        {name: "Linux Firefox Min_response_time", uv: 0, pv: 0.1},
        {name: "Linux Firefox Max_response_time", uv: 0, pv: 1},
        {name: "Linux Chrome Min_response_time", uv: 60000, pv: 0.2},
        {name: "Linux Chrome Max_response_time", uv: 60000, pv: 0.9},
        {name: "Mac Chrome Min_response_time", uv: 60000, pv: 0.1},
        {name: "Mac Chrome Max_response_time", uv: 60000, pv: 1},
        {name: "Mac Firefox Min_response_time", uv: 60000, pv: 0.2},
        {name: "Mac Firefox Max_response_time", uv: 60000, pv: 1.1},
        {name: "Linux Firefox Min_response_time", uv: 60000, pv: 0.3},
        {name: "Linux Firefox Max_response_time", uv: 60000, pv: 1.4}]
    )
*/