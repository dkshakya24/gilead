'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

// Define the question type
interface Question {
  id: string
  message: string
  checked: boolean
}

// Sortable item component
const SortableItem = ({
  question,
  onToggle
}: {
  question: Question
  onToggle: (id: string) => void
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border gap-[12px] rounded-lg px-4 py-1 mb-2 flex items-center shadow-sm"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600"
          >
            <GripVertical size={18} />
          </div>
        </TooltipTrigger>
        <TooltipContent> Drag to move this question</TooltipContent>
      </Tooltip>
      <input
        type="checkbox"
        checked={question.checked}
        onChange={() => onToggle(question.id)}
        className="rounded cursor-pointer border-gray-300 text-primary focus:ring-primary"
      />
      <span className="text-gray-700 text-sm ml-1">{question.message}</span>
    </div>
  )
}

export default function DraggableQuestions({ questions, setQuestions }: any) {
  // Initial questions data

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setQuestions((items: any) => {
        const oldIndex = items.findIndex((item: any) => item.id === active.id)
        const newIndex = items.findIndex((item: any) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Toggle question checked state
  const toggleQuestion = (id: string) => {
    setQuestions(
      questions.map((question: any) =>
        question.id === id
          ? { ...question, checked: !question.checked }
          : question
      )
    )
    // setCheckedQuestions(questions.filter((q: any) => q.checked))
  }

  // Get only checked questions

  return (
    <div className="max-w-2xl">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q: any) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question: any) => (
            <SortableItem
              key={question.id}
              question={question}
              onToggle={toggleQuestion}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
