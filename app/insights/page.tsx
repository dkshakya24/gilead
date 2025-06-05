'use client'

import { useEffect } from 'react'
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk'

const Insights = () => {
  // Define the URL of the API you want to call
  const apiUrl =
    'https://node-app-for-qbarembedding.onrender.com/generate-embed-url'
  // Function to fetch data from the API
  async function fetchData() {
    try {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('There was a problem fetching the data:', error)
    }
  }

  const embedGenerativeQnA = async () => {
    const responseData = await fetchData()
    const generatedURL = responseData.embedUrl // Ensure this is the correct property name

    const embeddingContext = await createEmbeddingContext({
      onChange: (changeEvent, metadata) => {
        console.log('Context received a change', changeEvent, metadata)
      }
    })
    const frameOptions = {
      url: generatedURL, // replace this value with the url generated via embedding API

      container: '#experience-container',
      height: '700px',
      width: '1000px',
      onChange: (changeEvent: { eventName: any }, metadata: any) => {
        switch (changeEvent.eventName) {
          case 'FRAME_MOUNTED': {
            console.log('Do something when the experience frame is mounted.')
            break
          }
          case 'FRAME_LOADED': {
            console.log('Do something when the experience frame is loaded.')
            break
          }
        }
      }
    }

    const contentOptions = {
      showTopicName: true,
      theme:
        'https://us-west-2.quicksight.aws.amazon.com/embedding/028f50f5aba14223849e38e777d082a4/q/search/nre/kjhkjhjh?isauthcode=true&identityprovider=quicksight&code=AYABeHYU9vUoUUBj9DuBncQvNJYAAAABAAdhd3Mta21zAEthcm46YXdzOmttczp1cy13ZXN0LTI6OTAwNjQ5NDI3MTk2OmtleS9iYzAzMTYzMy0xYzJiLTRlMzEtYWM5ZC0yODQ2NDkwZjEyM2YAuAECAQB4GTrtGnufGqRpvDXN80qWQP5C5v67xRWfqbMppBQ52E8BCtnBaXPAJruSa1VStE4YuQAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDP-IHHSuEpmZR2JZGwIBEIA7Us04nsOjb05Viwm_yD1Egp4VvGXeUBaxBngCzPQXt7Sz3IzYENWrOi7xZxKF2Snxd1PJQmRSgx_XnR0CAAAAAAwAABAAAAAAAAAAAAAAAAAA926Vz6n2cFdDel0IZmKryf____8AAAABAAAAAAAAAAAAAAABAAAAnmzSqWbbg0guOMDM6ORh857W_f-nJB-vrEW5UoHtUi_YBazXiIJ5gmgxWOrKXV_b7dclNlL8mcMdFDjO4iL2ae26SuOkILQWjpYRbtf4Q_SKqe7c_OTrmxpvXY2ByrSuPJjWnl7lJT-IzWuqqsvHJmxJfgu7qpfrqcEpXETGIWcBuQBQRkcY2NL7fI_H6uioMmguY1USae10efzzvs4Vz9B09HLhkr-CWDwrIEwB9A%3D%3D',
      allowTopicSelection: true,
      onMessage: async (
        messageEvent: { eventName: any },
        experienceMetadata: any
      ) => {
        switch (messageEvent.eventName) {
          case 'Q_SEARCH_OPENED': {
            console.log('Do something when Q Search content expanded')
            break
          }
          case 'Q_SEARCH_CLOSED': {
            console.log('Do something when Q Search content collapsed')
            break
          }
          case 'Q_SEARCH_SIZE_CHANGED': {
            console.log('Do something when Q Search size changed')
            break
          }
          case 'CONTENT_LOADED': {
            console.log('Do something when the Q Search is loaded.')
            break
          }
          case 'ERROR_OCCURRED': {
            console.log('Do something when the Q Search fails loading.')
            break
          }
        }
      }
    }
    const embeddedDashboardExperience = await embeddingContext.embedQSearchBar(
      frameOptions,
      contentOptions
    )
  }

  useEffect(() => {
    embedGenerativeQnA()
  }, [])
  return (
    <>
      <div className="w-full flex justify-center">
        <div className="mt-[20px]">
          <div id="experience-container" className="w-full h-full"></div>
        </div>
      </div>
    </>
  )
}

export default Insights
