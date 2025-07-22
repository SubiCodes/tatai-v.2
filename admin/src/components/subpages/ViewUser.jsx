import React from 'react'
import { useParams } from 'react-router-dom';

function ViewUser() {

    const { id } = useParams();

  return (
    <div>
      ViewUser: {id}
    </div>
  )
}

export default ViewUser
