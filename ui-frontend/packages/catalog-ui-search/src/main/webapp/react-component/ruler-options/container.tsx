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
import RulerOptionsPresentation from './presentation'
import withListenTo, {
  WithBackboneProps,
} from '../../react-component/backbone-container'
import Dropdown from '../presentation/dropdown'
import { hot } from 'react-hot-loader'

const Common = require('../../js/Common')

interface MapModel extends Backbone.Model {
  setStartingCoordinates: (coordinates: Object) => void
}

type Props = {
  map: MapModel
  userPreferences: Backbone.Model
} & WithBackboneProps

const Span = styled.span`
  padding-right: 5px;
`
// the coordinate format values in the user preferences aren't exactly the same as in the map model
const coordinateFormatsMapping = {
  degrees: 'dms',
  decimal: 'decimal',
  mgrs: 'mgrs',
  utm: 'utmUps',
}

function RulerOptions(props: Props) {
  const { map, userPreferences } = props
  let [endCoordinate, setEndCoordinate] = React.useState('')
  const startCoordinate = useModelProperty(props, 'startingCoordinates')
  const measurementState = useModelProperty(props, 'measurementState')
  const distance = useModelProperty(props, 'currentDistance')

  const coordinateFormat = userPreferences.get('coordinateFormat')
  const modelCoordinateValues = map.get('coordinateValues')
  // the coordinate format value returned from the defined mapping
  const format = hasKey(coordinateFormatsMapping, coordinateFormat)
    ? coordinateFormatsMapping[coordinateFormat]
    : ''

  let coordinateString,
    startCoordinateString = ''
  if (measurementState.value !== 'NONE') {
    // decimal format is a special case because the values are stored in multiple keys
    if (coordinateFormat === 'decimal') {
      coordinateString = `${modelCoordinateValues.lat} ${
        modelCoordinateValues.lon
      }`
      startCoordinateString = `${startCoordinate.value.lat} ${
        startCoordinate.value.lon
      }`
    } else {
      coordinateString = modelCoordinateValues[format]
      startCoordinateString = startCoordinate.value[format]
    }
  }

  if (measurementState.value === 'END') {
    endCoordinate = coordinateString
  } else {
    startCoordinateString = coordinateString
  }

  function changeStartCoordinate(value: string) {
    const convertedCoordinates = Common.convertCoordinateFormat(
      value,
      coordinateFormat
    )
    map.setStartingCoordinates(convertedCoordinates)
  }

  const rulerProps = {
    startCoordinate: {
      value: startCoordinateString,
      handleChange: changeStartCoordinate,
    },
    endCoordinate: { value: endCoordinate, handleChange: setEndCoordinate },
    distance: Number(distance.value),
    updateHandler: () => {},
    clearHandler: () => {},
  }
  const rulerOptions = <RulerOptionsPresentation {...rulerProps} />

  return (
    <Dropdown content={rulerOptions}>
      <Span className="interaction-text">Ruler</Span>
      <Span className="interaction-icon fa fa-calculator" />
    </Dropdown>
  )
}

/**
 * Helper method for setting up React effect hooks for Backbone model attributes.
 *
 * @param props - the component props (contains map model and Backbone props)
 * @param modelProperty - the property from the map model to listen for
 *
 * @returns - an object containing the updated value of the property and the handler function
 */
function useModelProperty(props: Props, modelProperty: string) {
  const { listenTo, stopListening, map } = props
  const [property, setProperty] = React.useState(map.get(modelProperty))

  function handleChange(model: MapModel) {
    setProperty(model.get(modelProperty))
  }

  // sets up a new listener for changes to the model property and returns a callback function to
  // remove the listener when the component is unmounted
  React.useEffect(() => {
    listenTo(map, `change:${modelProperty}`, handleChange)
    return () => stopListening(map, `change:${modelProperty}`, handleChange)
  })

  return {
    value: property,
    handleChange,
  }
}

/**
 * Helper method to determine if the given object contains the given key. This is needed for
 * TypeScript to not complain about incorrect index typing for object value accessing.
 *
 * @param obj - the object to search in
 * @param key - the key to search for
 *
 * @returns - a Boolean representing if the key was found in the object
 */
function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj
}

export default hot(module)(withListenTo(RulerOptions))
export const testComponent = withListenTo(RulerOptions)
