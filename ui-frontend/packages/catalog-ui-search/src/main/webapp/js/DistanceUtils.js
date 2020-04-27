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

/*jshint bitwise: false*/

const mtgeo = require('mt-geo')
const usngs = require('usng.js')
const converter = new usngs.Converter()
import getDistance from 'geolib/es/getDistance'

const EARTH_MEAN_RADIUS_METERS = 6371008.7714

const DEGREES_TO_RADIANS = Math.PI / 180
const RADIANS_TO_DEGREES = 1 / DEGREES_TO_RADIANS

const METERS_KILOMETERS = 1000
const METERS_FEET = 0.3048
const METERS_YARDS = 0.9144
const METERS_MILES = 1609.344
const METERS_NAUTICAL_MILES = 1852

/* 6 Digits of precision used because it gives precision up to 
0.11 meters, which was deemed precise enough for any use case 
of application */
const DECIMAL_PRECISION = 6

module.exports = {
  convertCoordinateFormat(coordinate, originalFormat) {
    if (originalFormat === '') {
      return coordinate
    }

    const usngPrecision = 6
    const coordinateFormatConversions = {
      degrees: mtgeo.parseDMS.bind(mtgeo),
      decimal: undefined,
      mgrs: converter.USNGtoLL.bind(converter),
      utm: converter.UTMUPStoLL.bind(converter),
    }
    const conversionMethod = coordinateFormatConversions[originalFormat]
    let latLon = []
    if (conversionMethod !== undefined) {
      const converted = conversionMethod(coordinate)
      if ('lat' in converted && 'lon' in converted) {
        latLon = [converted.lat, converted.lon]
      } else {
        latLon = [converted.north, converted.east]
      }
    } else {
      latLon = coordinate.split(' ')
    }
    // use lat/lon as the common starting point for all conversions below
    const [lat, lon] = latLon
    const convertedCoordinates = {
      dms: `${mtgeo.toLat(lat)} ${mtgeo.toLon(lon)}`,
      lat: lat,
      lon: lon,
      mgrs: converter.LLtoMGRS(lat, lon, usngPrecision),
      utmUps: converter.LLtoUTMUPS(lat, lon),
    }

    return convertedCoordinates
  },
  distanceBetweenCoordinates(from, to, format) {
    const { lat: latFrom, lon: lonFrom } = (format !== 'latlon')
      ? this.convertCoordinateFormat(from, format)
      : from
    const { lat: latTo, lon: lonTo } = (format !== 'latlon')
      ? this.convertCoordinateFormat(to, format)
      : to

    return getDistance(
      { latitude: latFrom, longitude: lonFrom },
      { latitude: latTo, longitude: lonTo }
    )
  },
  distToDegrees(distanceInMeters) {
    return this.toDegrees(this.distToRadians(distanceInMeters))
  },
  distToRadians(distanceInMeters) {
    return distanceInMeters / EARTH_MEAN_RADIUS_METERS
  },
  toDegrees(distanceInRadians) {
    return distanceInRadians * RADIANS_TO_DEGREES
  },
  getDistanceInMeters(distance, units) {
    distance = distance || 0
    switch (units) {
      case 'kilometers':
        return distance * METERS_KILOMETERS
      case 'feet':
        return distance * METERS_FEET
      case 'yards':
        return distance * METERS_YARDS
      case 'miles':
        return distance * METERS_MILES
      case 'nautical miles':
        return distance * METERS_NAUTICAL_MILES
      case 'meters':
      default:
        return distance
    }
  },
  getDistanceFromMeters(distance, units) {
    distance = distance || 0
    switch (units) {
      case 'kilometers':
        return distance / METERS_KILOMETERS
      case 'feet':
        return distance / METERS_FEET
      case 'yards':
        return distance / METERS_YARDS
      case 'miles':
        return distance / METERS_MILES
      case 'nautical miles':
        return distance / METERS_NAUTICAL_MILES
      case 'meters':
      default:
        return distance
    }
  },
  altitudeRound(value) {
    // round the value, don't need picometer precision.
    return Math.round(value)
  },
  coordinateRound(value) {
    return parseFloat(parseFloat(value).toFixed(DECIMAL_PRECISION))
  },
}
