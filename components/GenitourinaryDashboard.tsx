'use client'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from './carousel'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from './DashboardCard'
import { esmoText, ascoText, ascoText2024 } from '@/lib/utils'

export default function GenitourinaryDashboard() {
  const [displayedText, setDisplayedText] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null) // Store interval reference

  const showTakeways = (keyFindingsData: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current) // Clear existing interval

    const words = keyFindingsData.split(' ')
    let index = 0
    setDisplayedText(words[0]) // Initialize with the first word

    intervalRef.current = setInterval(() => {
      index++
      if (index < words.length) {
        setDisplayedText(prev => prev + ' ' + words[index])
      } else {
        clearInterval(intervalRef.current!) // Stop interval after last word
        intervalRef.current = null // Reset ref
      }
    }, 0)
  }

  const conferences = [
    {
      name: 'ASCO Annual Meeting 2025',
      location: 'Chicago',
      year: '30 May-03 June 2025',
      description: 'TBD',
      bgClass: 'bg-purple-50'
    },
    // {
    //   name: 'ESMO Congress 2024',
    //   location: 'Barcelona',
    //   year: '13-17 Sep 2024',
    //   description: '25',
    //   bgClass: 'bg-purple-50'
    // },
    // {
    //   name: 'ASCO Genitourinary Cancers Symposium 2025 abstracts',
    //   location: 'Moscone West, San Francisco',
    //   year: '13-15 Feb 2025',
    //   description: '250',
    //   bgClass: 'bg-purple-50'
    // },
    {
      name: 'ASCO 2024 Annual',
      location: 'McCormick Place, Chicago',
      year: '2024',
      description: '69 (Bladder + CRC)',
      bgClass: 'bg-purple-50'
    },
    {
      name: 'SITC Annual Meeting',
      location: 'Location TBD',
      year: '2024',
      description: 'TBD',
      bgClass: 'bg-purple-50',
      disabled: true
    }
  ]

  return (
    <div className="flex flex-col mb-4">
      <main className="flex-1">
        <section className="pt-4">
          <div className="container px-4">
            <Carousel
              opts={{
                align: 'start',
                loop: true
              }}
              className="w-full max-w-7xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4 justify-center">
                {conferences.map(conference => (
                  <CarouselItem
                    key={conference.name}
                    className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card
                      className={`relative overflow-hidden ${conference.bgClass}`}
                    >
                      {/* {conference.disabled && (
                        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center text-lg font-medium">
                          Coming Soon
                        </div>
                      )} */}
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <MapPin className="h-3 w-3" />
                          <span>{conference.location}</span>
                        </div>
                        <CardTitle
                          title={conference.name}
                          className="truncate overflow-hidden pr-2 whitespace-nowrap w-[100%] text-lg text-gray-800 font-medium mt-2"
                        >
                          {conference.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Image
                          src={
                            conference.name ===
                            'ASCO Genitourinary Cancers Symposium 2025 abstracts'
                              ? '/ASCO.png'
                              : conference.name === 'ASCO 2024 Annual'
                                ? '/asco2024.jpg'
                                : conference.name === 'ESMO Congress 2024'
                                  ? '/esmo.jpg'
                                  : conference.name ===
                                      'ASCO Annual Meeting 2025'
                                    ? '/asco2025.png'
                                    : '/placeholder.svg'
                          }
                          alt={conference.name}
                          width={300}
                          height={10}
                          className={`rounded-xl w-full h-[150px] ${conference.name === 'ASCO Genitourinary Cancers Symposium 2025' ? 'object-cover' : 'object-contain'}`}
                        />
                        <div className="mt-3 space-y-1">
                          <p className="text-sm">
                            <span className="font-semibold">Year:</span>{' '}
                            {conference.year}
                          </p>
                          <p className="text-sm">
                            <span className="font-semibold mr-1">
                              No of Abstracts:
                            </span>
                            {conference.description}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <div className="flex flex-col gap-2 w-full">
                          <Button
                            className="w-full text-xs"
                            variant="default"
                            size="sm"
                            // disabled={conference.disabled}
                            title={
                              conference.name === 'ASCO Annual Meeting 2025'
                                ? 'Click to see the agenda '
                                : ''
                            }
                            onClick={() => {
                              if (
                                conference.name === 'ASCO Annual Meeting 2025'
                              ) {
                                window.open(
                                  'https://cdn.bfldr.com/KOIHB2Q3/as/rmvn96w7b6ppkgvzxw99sn98/AM25-Program-Announcement',
                                  '_blank'
                                )
                              } else if (
                                conference.name === 'ASCO 2025 Annual'
                              ) {
                                window.open('#', '_blank')
                              } else {
                                showTakeways(
                                  conference.name === 'ESMO Congress 2024'
                                    ? esmoText
                                    : conference.name ===
                                        'ASCO Genitourinary Cancers Symposium 2025 abstracts'
                                      ? ascoText
                                      : conference.name === 'ASCO 2024 Annual'
                                        ? ascoText2024
                                        : ''
                                )
                              }
                            }}
                          >
                            {conference.name === 'ASCO Annual Meeting 2025' ||
                            conference.name === 'ASCO 2024 Annual'
                              ? 'Program Details'
                              : 'Key Takeaways'}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-12" />
              <CarouselNext className="hidden md:flex -right-12" />
            </Carousel>
          </div>
        </section>
      </main>
      {displayedText && (
        <div className="group overflow-auto max-h-[400px] leading-8 mx-[70px] p-6 mt-10 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px] rounded-md border border-1 shadow-sm">
          <ReactMarkdown>{displayedText}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}
