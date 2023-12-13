import { API_URL } from "../services/API_URL"
import { useState, useEffect } from 'react'

export const AllConversations = () => {

    useEffect(() => {
        axios.get(API_URL + '/conversations?_embed=queries')
        .then((respons) => {
            console.log(response.data)
        })
        .catch((err))
    })

  return (
    <div>AllConversations</div>
  )
}
