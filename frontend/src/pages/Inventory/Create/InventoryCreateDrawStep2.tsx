import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, useFormContext } from "react-hook-form"
import { Stack } from "@mantine/core"
import FixedBottom from "../../../components/FixedBottom"
import SubmitButton from "../../../components/SubmitButton"
import type { FormValues } from "./InventoryCreateDraw"
import useCreateState from "./useCreateState"
import InventoryCreateDrawStepComponent from "./InventoryCreateDrawStepComponent"
import type { DropResult } from "react-beautiful-dnd"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import DraggableToken from "./DraggableToken"

const remove = (list: string[], index: number): string[] => {
  const result = [...list]
  result.splice(index, 1)
  return result
}

const reorder = (list: string[], startIndex: number, endIndex: number): string[] => {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const InventoryCreateDrawStep2 = () => {
  const navigate = useNavigate()
  const state = useCreateState()
  const { collectionAddress, isPfp } = state

  const { setValue, watch } = useFormContext<FormValues>()
  const { handleSubmit } = useForm()

  const { title, tokenAddresses } = watch()

  useEffect(() => {
    if (!title) navigate("..", { state })
  }, [navigate, state, title])

  const onDelete = (index: number) => {
    if (!window.confirm("Are you sure?")) return
    setValue("tokenAddresses", remove(tokenAddresses, index))
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    const items = reorder(tokenAddresses, source.index, destination.index)
    setValue("tokenAddresses", items)
  }

  const submit = handleSubmit(() => {
    navigate("../3", { state, replace: true })
  })

  return (
    <form onSubmit={submit}>
      <InventoryCreateDrawStepComponent
        step={2}
        title={"Drag items to rank prizes.\nThe first prize becomes the thumbnail."}
        back=".."
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <Stack spacing={0} {...provided.droppableProps} ref={provided.innerRef}>
                {tokenAddresses.map((id, index) => (
                  <Draggable draggableId={id} index={index} key={id}>
                    {(providedDraggable, snapshotDraggable) => (
                      <DraggableToken
                        {...providedDraggable.draggableProps}
                        collectionAddress={collectionAddress}
                        tokenAddress={id}
                        order={index + 1}
                        onDelete={() => onDelete(index)}
                        dragHandleProps={providedDraggable.dragHandleProps}
                        isDragging={snapshotDraggable.isDragging}
                        isDraggingOver={snapshot.isDraggingOver}
                        isPfp={isPfp}
                        ref={providedDraggable.innerRef}
                      />
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>

        <FixedBottom>
          <SubmitButton>Simulate Draw</SubmitButton>
        </FixedBottom>
      </InventoryCreateDrawStepComponent>
    </form>
  )
}

export default InventoryCreateDrawStep2
