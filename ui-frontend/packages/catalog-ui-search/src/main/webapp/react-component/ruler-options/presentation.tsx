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
  coordinateString: string
  distance: number
  coordinateUpdateHandler: (e: Event) => void
}

const Root = styled.div`
  overflow: auto;
  min-width: ${props => props.theme.minimumScreenSize};
  padding: ${props => props.theme.minimumSpacing};
`
const Text = styled.div`
  line-height: 1.2rem;
`
const Description = styled.div`
  opacity: ${props => props.theme.minimumOpacity};
`

const render = (props: Props) => {
  const { coordinateString, distance, coordinateUpdateHandler } = props
  // use meters when distance is under 1000m and convert to kilometers when ≥1000m
  const distanceText =
    distance < 1000 ? `${distance} m` : `${distance * 0.001} km`

  return (
    <Root>
      <Text>
        <Description>Start Coordinate</Description>
      </Text>
      <TextField
        placeholder={coordinateString}
        value={coordinateString}
        onChange={coordinateUpdateHandler}
      />

      <Text>
        <Description>End Coordinate</Description>
      </Text>
      <TextField
        placeholder={coordinateString}
        value={coordinateString}
        onChange={coordinateUpdateHandler}
      />

      <Text>
        <Description>Distance</Description>
        {distanceText}
      </Text>
    </Root>
  )
}

export default hot(module)(render)
export const testComponent = render
