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
import styled from 'styled-components'
import { hot } from 'react-hot-loader'

const TextField = require('../text-field/index')

type Props = {
  startCoordinate: { value: string; handleChange: (value: string) => void }
  endCoordinate: { value: string; handleChange: (value: string) => void }
  distance: number
  updateHandler: (start: string, end: string) => void
  clearHandler: () => void
}

const Root = styled.div`
  overflow: auto;
  min-width: ${props => props.theme.minimumScreenSize};
  padding: ${props => props.theme.minimumSpacing};
`
const Text = styled.div`
  line-height: 1.2rem;
`
const TextWrapper = styled.div`
  padding: ${({ theme }) => theme.minimumSpacing};
`
const Description = styled.div`
  opacity: ${props => props.theme.minimumOpacity};
`
const UpdateButton = styled.button`
  padding-right: ${props => props.theme.largeSpacing};
  padding-left: ${props => props.theme.largeSpacing};
  margin: 0 !important;
  border: 1px solid black;
  background-color: #1abf03;
`
const ClearButton = styled.button`
  padding-right: ${props => props.theme.largeSpacing};
  padding-left: ${props => props.theme.largeSpacing};
  margin: 0 !important;
  border: 1px solid black;
  background-color: #ff0000;
`

const render = (props: Props) => {
  const {
    startCoordinate,
    endCoordinate,
    distance,
    updateHandler,
    clearHandler,
  } = props
  const [start, setStart] = React.useState(startCoordinate.value)
  const [end, setEnd] = React.useState(endCoordinate.value)
  // use meters when distance is under 1000m and convert to kilometers when ≥1000m
  const distanceText =
    distance < 1000 ? `${distance} m` : `${distance * 0.001} km`

  function submitUpdate(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    console.log(`{ start: "${start}", end: "${end}" }`)
    updateHandler(start, end)
  }

  return (
    <Root>
      <TextWrapper>
        <Text>
          <Description>Start Coordinate</Description>
        </Text>

        <TextField
          autoFocus
          placeholder={startCoordinate.value}
          value={start}
          onChange={setStart}
        />
      </TextWrapper>

      <TextWrapper>
        <Text>
          <Description>End Coordinate</Description>
        </Text>

        <TextField
          autoFocus
          placeholder={endCoordinate.value}
          value={end}
          onChange={setEnd}
        />
      </TextWrapper>

      <TextWrapper>
        <Text>
          <Description>Distance</Description>
          {distanceText}
        </Text>
      </TextWrapper>

      <UpdateButton
        onClick={submitUpdate}
        title="Update the selected coordinates"
      >
        <span>Update</span>
      </UpdateButton>
      <ClearButton
        onClick={clearHandler}
        title="Clears the selected coordinates"
      >
        <span>Clear</span>
      </ClearButton>
    </Root>
  )
}

export default hot(module)(render)
export const testComponent = render
