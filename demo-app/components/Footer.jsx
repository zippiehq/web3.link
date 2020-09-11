import React, { useState, useEffect } from 'react'
import Box from '@material-ui/core/Box'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'

const LinkComponent = ({ title, path }) => {
  return (
    <Typography color="textPrimary" style={{ color: 'white' }} variant="body2">
      <Link to={path} style={{ color: 'inherit', textDecoration: 'none', marginLeft: '16px' }}>
        {title}
      </Link>
    </Typography>
  )
}

export const Footer = () => {
  return (
    <Box display="flex" minHeight="70px" paddingLeft="8%" paddingRight="8%" bgcolor="#373F41" alignItems="center">
      <Typography variant="h5" style={{ color: 'white' }}>
        LOGO
      </Typography>
      <Box ml="auto" />
      <LinkComponent title="Privacy Policy " />
      <LinkComponent title="Terms of Service" />
      <LinkComponent title="Legal" />
    </Box>
  )
}
