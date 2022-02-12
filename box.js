import React from 'react';
import {View, Text} from 'react-native';

import styled from 'styled-components/native';
import styles from 'Styles/style';
import {AreaChart, Grid} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import Ionicons from 'react-native-vector-icons/Ionicons';

const data = [0, 10, 20, 25, 30, 50, 85, 100];

const TextSubItem = styled.Text`
  font-size: 14px;
  color: ${(props) => props.color};
`;
const TextPercentage = styled.Text`
  font-size: 20px;
`;
const ElementItemContentText = styled.View`
  width: 80%;
`;
const ElementItemIcon = styled.View`
  width: 20px;
  top: 2px;
  margin-right: 5px;
`;
const ElementItem = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
`;
const Title = styled.Text`
  color: ${(props) => props.color};
  font-size: 14px;
  text-transform: uppercase;
  font-weight: bold;
`;
const Quantity = styled.Text`
  color: ${(props) => props.color};
  font-weight: bold;
  font-size: 35px;
  margin-bottom: 6px;
`;
const Element = styled.View`
  width: 50%;
  padding-left: 10px;
`;
const Content = styled.View`
  border-radius: 10px;
  width: 90%;
  height: 100%;
  background-color: white;
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 14px;
  padding-right: 24px;
  shadow-opacity: 0.8;
  shadow-radius: 4px;
  shadow-color: rgba(119, 110, 225, 0.14);
  shadow-offset: 0px 22px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
  align-content: stretch;
  justify-content: center;
`;
const Center = styled.View`
  height: 133px;
  padding-top: 10px;
  padding-bottom: 5px;
  margin-bottom: 12px;
  align-items: center;
  top: -16px;
`;
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
const Box = (props) => {
  return (
    <Center>
      <Content>
        <Element>
          <Title color={styles.boxTitleColor}>{props.title}</Title>
          <Quantity     numberOfLines={1}
 adjustsFontSizeToFit color={styles.boxNumberColor}>{numberWithCommas(props.quantity)}</Quantity>
          <AreaChart
            style={{height: 30}}
            data={data}
            curve={shape.curveNatural}
            svg={{
              fill: 'rgb(255, 139, 181)',
              fillOpacity: 0.5,
              fillRule: 'evenodd',
              strokeWidth: 0.5,
              stroke: 'red',
            }}
          />
        </Element>
        <Element>
          <ElementItem>
            <ElementItemIcon>
              <Ionicons name="arrow-down-outline" size={16} color="#34C360" />
            </ElementItemIcon>
            <ElementItemContentText>
              <TextPercentage >{props.label1Value}</TextPercentage>
              <TextSubItem color={styles.ItemTextSubItem}>
                {props.label1}
              </TextSubItem>
            </ElementItemContentText>
          </ElementItem>
          <ElementItem>
            <ElementItemIcon>
              <Ionicons name="arrow-up-outline" size={16} color="#FA5252" />
            </ElementItemIcon>
            <ElementItemContentText>
              <TextPercentage>{props.label2Value}</TextPercentage>
              <TextSubItem color={styles.ItemTextSubItem}>
                {props.label2}
              </TextSubItem>
            </ElementItemContentText>
          </ElementItem>
        </Element>
      </Content>
    </Center>
  );
};
export default Box;
