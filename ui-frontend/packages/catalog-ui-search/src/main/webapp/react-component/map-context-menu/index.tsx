/**
 * Copyright (c) Codice Foundation
 *
 * This is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser
 * General Public License as published by the Free Software Foundation, either version 3 of the
 * License, or any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details. A copy of the GNU Lesser General Public License
 * is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 *
 **/
import * as React from 'react'
import CopyCoordinates from '../copy-coordinates'
import SelectCoordinates from '../select-coordinates'
import { Menu, MenuItem } from '../menu'
import styled from 'styled-components'
const user = require('../../component/singletons/user-instance.js')

const Icon = styled.div`
  display: inline-block;
  text-align: center;
  width: ${props => props.theme.minimumFontSize};
`
const Title = styled.div`
  display: inline-block;
  margin-left: ${props => props.theme.minimumSpacing};
  margin-right: ${props => props.theme.minimumSpacing};
`
const Description = styled.div`
  display: block;
  margin-left: calc(
    ${props => props.theme.minimumSpacing} +
      ${props => props.theme.minimumFontSize}
  );
  margin-right: ${props => props.theme.minimumSpacing};
  line-height: normal;
  margin-top: calc(0 - ${props => props.theme.minimumSpacing});
  margin-bottom: ${props => props.theme.minimumSpacing};
`

interface Props {
  onChange: (value: string) => void
  mouseLat?: number
  mouseLon?: number
  target?: string
  coordinateValues: {
    dms: string
    lat: string
    lon: string
    mgrs: string
    utmUps: string
  }
  selectionCount: number
  closeMenu: () => void
  key: number
  selectCoordHandler: () => void
  clearRulerHandler: () => void
  mapModel: Backbone.Model
}

const renderCopyCoordinatesMenu = ({ coordinateValues, closeMenu }: Props) => (
  <MenuItem value="CopyCoordinates">
    <CopyCoordinates
      coordinateValues={coordinateValues}
      closeParent={closeMenu}
    />
  </MenuItem>
)

const renderSelectCoordinatesMenu = ({
  coordinateValues,
  closeMenu,
  selectCoordHandler,
  clearRulerHandler,
  mapModel,
}: Props) => {
  const { dms, lat, lon, mgrs, utmUps } = coordinateValues
  const userPreferences = user.get('user').get('preferences')
  const coordinateFormat = userPreferences.get('coordinateFormat')
  let coord = ''
  switch (coordinateFormat) {
    case 'degrees':
      coord = dms
      break
    case 'decimal':
      coord = `${lat} ${lon}`
      break
    case 'mgrs':
      coord = mgrs
      break
    case 'utm':
      coord = utmUps
      break
    default:
      break
  }

  return (
    <MenuItem value="SelectCoordinates">
      <SelectCoordinates
        coordinates={coord}
        closeParent={closeMenu}
        selectCoordHandler={selectCoordHandler}
        clearRulerHandler={clearRulerHandler}
        mapModel={mapModel}
      />
    </MenuItem>
  )
}

const renderHistogramMenu = () => (
  <MenuItem value="Histogram">
    <Icon className="interaction-icon fa fa-bar-chart" />
    <Title>View Histogram</Title>
  </MenuItem>
)

const renderHistogramSelectionMenu = ({ selectionCount }: Props) => (
  <MenuItem value="HistogramSelection">
    <Icon className="interaction-icon fa fa-bar-chart" />
    <Title>View Histogram (selected results)</Title>
    <Description>({selectionCount} selected)</Description>
  </MenuItem>
)

const renderInspectorMenu = ({ target }: Props) => (
  <MenuItem value="Inspector">
    <Icon className="interaction-icon fa fa-info" />
    <Title>View Inspector</Title>
    <Description>({target})</Description>
  </MenuItem>
)

const renderMenu = ({ onChange, key }: Props, menuItems: any[]) => (
  <Menu key={key} onChange={onChange}>
    {menuItems}
  </Menu>
)

const renderInspectorSelectionMenu = ({ selectionCount }: Props) => (
  <MenuItem value="InspectorSelection">
    <Icon className="interaction-icon fa fa-info" />
    <Title>View Inspector (selected results)</Title>
    <Description>({selectionCount} selected)</Description>
  </MenuItem>
)

export const MapContextMenu = (props: Props) => {
  const { mouseLat, mouseLon, selectionCount, target } = props
  const hasTarget = typeof target === 'string'
  const hasSelection = selectionCount > 0
  const hasMouseCoordinates =
    typeof mouseLat === 'number' && typeof mouseLon === 'number'
  const menuItems = []
  if (hasMouseCoordinates) {
    menuItems.push(renderCopyCoordinatesMenu(props))
    menuItems.push(renderSelectCoordinatesMenu(props))
  }
  menuItems.push(renderHistogramMenu())
  if (hasSelection) {
    menuItems.push(renderHistogramSelectionMenu(props))
  }
  if (hasTarget) {
    menuItems.push(renderInspectorMenu(props))
  }
  if (hasSelection) {
    menuItems.push(renderInspectorSelectionMenu(props))
  }
  const keyedItems = menuItems.map((m, i) => ({ key: i, ...m }))
  return renderMenu(props, keyedItems)
}
