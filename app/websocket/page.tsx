'use client'

import { auth } from '@/auth'
import LoginForm from '@/components/login-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import React, { useState, useEffect } from 'react'
const WebSocketComponent = () => {
  const [streamingResponse, setStreamingResponse] = useState<string>('')
  const [socket, setSocket] = useState<any>(null)
  const [drawerState, setDrawerState] = useState(false)
  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket(
      'wss://kxihu3nwwg.execute-api.us-east-1.amazonaws.com/Dev/'
    )

    // WebSocket event listeners
    ws.onopen = () => {
      console.log('WebSocket connection established.')
    }

    ws.onmessage = event => {
      // const messagesssss = JSON.parse(event.data)
      // Handle incoming messages
      const newChunk = JSON.stringify(event.data)
      const concatenatedResponse = Object.values(newChunk).join('')
      setStreamingResponse(prevResponse => prevResponse + concatenatedResponse)
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed.')
    }
    setSocket(ws)

    return () => {
      // Clean up WebSocket connection on component unmount
      ws.close()
    }
  }, [])

  const sendMessage = () => {
    const payload = {
      action: 'sendmessage',
      chatter_id: '32699507-025a-40b8-8c8c-774fbdccd6aa',
      question:
        'How can we position Iptacopan as a treatment pillar in IgAN disease area?',
      user_id: 'renuka.sai@chryselys.com'
    }
    const payload1 = {
      action: 'sendmessage',
      required: {
        chatter_id: '417a4b52-851f-4f72-b6cb-ea753e0ac984',
        study_type: ['drivers_and_barriers', 'patient_case_optimization'],
        speciality: [
          'medical_oncology',
          'uro_oncology',
          'nuclear_medicine',
          'radiation_oncology'
        ],
        practice_setting: [
          'group',
          'academic',
          'community_hospital',
          'solo',
          'cancer_center',
          'comprehensive_care_center',
          'non_teaching',
          'multi_speciality_practice',
          'community_based_group_private_practice'
        ],
        question:
          'What are some questions related to mCRPC treatment that I can ask CHECK?'
      }
    }
    // const combinedMessage = { payload }
    // Send JSON message over WebSocket
    socket.send(JSON.stringify(payload))
  }

  return (
    <div className="p-6">
      {/* {messages.map((msg, index) => (
        <li key={index}>{JSON.stringify(msg)}</li> // Display JSON as string
      ))} */}
      <p>{streamingResponse.replace(/["\\]+/g, '')}</p>
      <div className="drawer drawer-end">
        {/* <input id="my-drawer-4" type="checkbox" className="drawer-toggle" /> */}
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn bg-primary text-white"
            onClick={() => {
              sendMessage()
            }}
          >
            send{' '}
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <li>
              <a>Sidebar Item 1</a>
            </li>
            <li>
              <a>Sidebar Item 2</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WebSocketComponent
