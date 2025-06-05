'use client'

import { useEffect, useRef } from 'react'
import { X, Sparkles, Users, Search, TrendingUp } from 'lucide-react'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-3 sm:mx-0 transform transition-all duration-300 ease-out sm:max-h-none max-h-[90vh] sm:block flex flex-col"
      >
        <div className="bg-gradient-to-r from-[#eb3c96] via-[#eb3c96] to-[#eb3c96] p-3 sm:p-4 rounded-t-2xl relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#eb3c96]/20 p-1.5 sm:p-2 rounded-full">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Welcome to your WAO ASCO 2025 experience!
              </h2>
              <p className="text-sm text-white">
                Your AI-powered congress assistant
              </p>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 sm:overflow-visible overflow-y-auto flex-grow">
          {/* <p className="text-sm sm:text-base text-gray-600 text-center mb-4">
            Your AI-powered partner designed to enhance your ASCO experience
            like never before!
          </p> */}

          <div className="bg-gradient-to-r from-[#eb3c96]/5 to-[#eb3c96]/5 rounded-lg p-3 mb-4">
            <p className="text-sm text-center text-gray-700 font-medium">
              Your AI-powered partner designed to enhance your ASCO 2025
              experience like never before! <br />
              WAO AI Congress Assistant helps you stay ahead, informed, and
              connected.
            </p>
          </div>

          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            With WAO AI Congress Assistant, you'll be able to:
          </h4>

          <div className="space-y-2">
            {/* <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="bg-blue-100 p-1.5 rounded-lg flex-shrink-0">
                <Search className="text-blue-600" size={16} />
              </div>
              <p className="text-sm text-gray-700">
                <strong>Ask anything</strong> about Merck's internal ASCO
                agenda.
              </p>
            </div> */}

            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="bg-purple-100 p-1.5 rounded-lg flex-shrink-0">
                <Users className="text-purple-600" size={16} />
              </div>
              <p className="text-sm text-gray-700">
                <strong>Track where key speakers</strong> are presenting.
              </p>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="bg-indigo-100 p-1.5 rounded-lg flex-shrink-0">
                <TrendingUp className="text-indigo-600" size={16} />
              </div>
              <p className="text-sm text-gray-700">
                <strong>Get real-time insights</strong> from the congress
                exploring abstracts and getting answers about CRC, UC, Head &
                Neck and TGCT.
              </p>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="bg-green-100 p-1.5 rounded-lg flex-shrink-0">
                <Sparkles className="text-green-600" size={16} />
              </div>
              <p className="text-sm text-gray-700">
                <strong>Ask about Merck/ EMD Serono</strong> and competitor
                products.
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
