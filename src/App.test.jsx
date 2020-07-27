import React from 'react';

import { shallow } from 'enzyme';

import './helpers/enzyme_setup';

import App from './App';

describe('App', () => {
  let component;

  beforeEach(() => {
    component = shallow(<App />);
  });

  it('should render', () => {
    expect(component).toBeTruthy();
    expect(component).toMatchSnapshot();
  });
});
