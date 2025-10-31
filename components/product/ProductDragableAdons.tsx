"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Addons } from "@/types/auth";
import api from "@/lib/axios";
import { showToast } from "../common/ShowToast";
import CreateAddonModal from "./CreateAddonModal";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";

type AddonsResponse = {
  success: boolean;
  message: string;
  data: Addons[];
};

type ContainerId = "available" | "selected";
type ProductDragableProps = {
  handleFormDataChange(key: string, value: any): void;
  value: string[];
  field: {
    key: string;
    type: string;
  };
  currencyID?: string;
};

/** Sortable card component */
function SortableItem({
  item,
  changeAddonCategory,
  id,
}: {
  item: Addons;
  id: ContainerId;
  changeAddonCategory: (
    type: "available" | "selected",
    addOnId: string
  ) => void;
}) {
  const { addonID, name, description, addonPrice, currencyCode } = item;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: addonID });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div className="flex flex-row items-center">
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white border border-gray-300 rounded-md p-3 mb-2 cursor-grab shadow-sm hover:bg-gray-50 select-none w-full"
      >
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-600">{description}</div>
        <div className="text-xs mt-1 text-gray-800">
          {addonPrice.toFixed(2)} {currencyCode}
        </div>
      </div>
      <div className="mr-4">
        {id === "available" ? (
          <IoMdAddCircleOutline
            className="w-6 h-6 cursor-pointer"
            title="Add"
            onClick={() => changeAddonCategory(id, addonID)}
          />
        ) : (
          <IoIosRemoveCircleOutline
            className="w-6 h-6 cursor-pointer"
            title="Remove"
            onClick={() => changeAddonCategory(id, addonID)}
          />
        )}
      </div>
    </div>
  );
}

/** Droppable list wrapper */
function DroppableList({
  id,
  title,
  items,
  emptyText,
  setRefetch,
  changeAddonCategory,
}: {
  id: ContainerId;
  title: string;
  items: Addons[];
  emptyText: string;
  setRefetch: Dispatch<SetStateAction<number>>;
  changeAddonCategory: (
    type: "available" | "selected",
    addOnId: string
  ) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      data-container-id={id}
      className={`flex-1 rounded-lg p-4 min-h-[250px] max-h-[500px] transition-colors overflow-y-scroll ${
        id === "available" ? "bg-gray-100" : "bg-blue-50"
      } ${isOver ? "ring-2 ring-offset-2 ring-blue-300" : ""}`}
    >
      <div className="flex flex-row items-center justify-between">
        <h3
          className={`text-lg font-semibold mb-3 ${
            id === "available" ? "text-gray-700" : "text-blue-700"
          }`}
        >
          {title}
        </h3>
        {id === "available" && <CreateAddonModal setRefetch={setRefetch} />}
      </div>

      <SortableContext
        items={items?.map((i) => i?.addonID) ?? []}
        strategy={rectSortingStrategy}
      >
        {items?.length > 0 ? (
          items?.map((item) => (
            <SortableItem
              key={item?.addonID}
              item={item}
              changeAddonCategory={changeAddonCategory}
              id={id}
            />
          ))
        ) : (
          <p
            className={`text-sm italic ${
              id === "available" ? "text-gray-500" : "text-blue-500"
            }`}
          >
            {emptyText}
          </p>
        )}
      </SortableContext>
    </div>
  );
}

export default function ProductDragableAdons({
  handleFormDataChange,
  field,
  value,
  currencyID,
}: ProductDragableProps) {
  const [available, setAvailable] = useState<Addons[]>([]);
  const [refetch, setRefetch] = useState(1);

  const [selected, setSelected] = useState<Addons[]>([]);

  const availableRef = useRef<Addons[]>(available);
  const selectedRef = useRef<Addons[]>(selected);
  useEffect(() => {
    const getAllAddons = async (currencyID: string) => {
      try {
        const res = await api.get<AddonsResponse>(
          `/api/v1/product-addon/ByCurrencyID/${currencyID}`
        );
        if (res?.data?.success) {
          const response = res?.data?.data;
          const selectedAddons = response.filter((addon) =>
            value?.includes(addon?.addonID)
          );

          const availableAddons = response.filter(
            (addon) => !value?.includes(addon?.addonID)
          );

          setSelected(selectedAddons);
          setAvailable(availableAddons);
        }
      } catch {
        showToast({
          message: `Failed to fetch addons.`,
          type: "error",
        });
      }
    };
    if (currencyID) {
      getAllAddons(currencyID);
    }
  }, [currencyID, refetch]);

  useEffect(() => {
    availableRef.current = available;
  }, [available]);

  useEffect(() => {
    selectedRef.current = selected;
    // const selectedIds = selected.map((val)=>val?.addonID);
    // handleFormDataChange && handleFormDataChange("addonIDs",selectedIds ?? []);
  }, [selected]);

  // dev check for duplicate addonIDs
  useEffect(() => {
    const allIds =
      [...(available ?? []), ...(selected ?? [])]?.map((i) => i?.addonID) ?? [];
    const dup = allIds?.filter((id, idx) => allIds?.indexOf(id) !== idx);
    // if (dup.length) {
    //   console.warn("Duplicate addonIDs detected:", [...new Set(dup)]);
    // }
  }, [available, selected]);

  const sensors = useSensors(useSensor(PointerSensor));

  const findContainer = (id: UniqueIdentifier | null): ContainerId | null => {
    if (!id) return null;
    const idStr = String(id);
    if (availableRef.current.some((i) => i.addonID === idStr))
      return "available";
    if (selectedRef.current.some((i) => i.addonID === idStr)) return "selected";
    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const from = findContainer(activeId);
    if (!from) return;

    let to: ContainerId | null = null;
    if (overId === "available" || overId === "selected") {
      to = overId as ContainerId;
    } else {
      to = findContainer(overId);
    }
    if (!to) return;

    if (from === to) {
      const list =
        from === "available" ? availableRef.current : selectedRef.current;
      const oldIndex = list.findIndex((i) => i.addonID === activeId);
      const newIndex = list.findIndex((i) => i.addonID === overId);
      if (oldIndex === -1 || newIndex === -1) return;
      if (oldIndex !== newIndex) {
        const setter = from === "available" ? setAvailable : setSelected;
        setter((prev) => arrayMove(prev, oldIndex, newIndex));
      }
      return;
    }

    const fromList =
      from === "available" ? availableRef.current : selectedRef.current;
    const movingItem = fromList.find((i) => i.addonID === activeId);
    if (!movingItem) return;

    if (from === "available") {
      setAvailable((prev) => prev.filter((i) => i.addonID !== activeId));
    } else {
      setSelected((prev) => prev.filter((i) => i.addonID !== activeId));
    }

    const insertItem = (
      list: Addons[],
      movingItem: Addons,
      targetIndex: number | null
    ) => {
      const next = [...list];
      if (
        targetIndex === null ||
        targetIndex === -1 ||
        targetIndex === list.length
      ) {
        next.push(movingItem);
      } else {
        next.splice(targetIndex, 0, movingItem);
      }
      return next;
    };

    if (to === "available") {
      setAvailable((prev) =>
        insertItem(
          prev,
          movingItem,
          overId === "available"
            ? prev.length
            : prev.findIndex((i) => i.addonID === overId)
        )
      );
    } else {
      setSelected((prev) =>
        insertItem(
          prev,
          movingItem,
          overId === "selected"
            ? prev.length
            : prev.findIndex((i) => i.addonID === overId)
        )
      );
    }
  };
  useEffect(() => {
    const selectedAddonIds = selected?.map((addOns) => addOns?.addonID);
    handleFormDataChange(field?.key, selectedAddonIds);
  }, [selected]);
  const changeAddonCategory = (
    type: "available" | "selected",
    addOnId: string
  ) => {
    console.log("called", type, addOnId);
    if (type === "selected") {
      const clickedAddon = selected?.find(
        (addon) => addon?.addonID === addOnId
      );
      if (clickedAddon) {
        setSelected((prev) =>
          prev?.filter((addon) => addon?.addonID !== addOnId)
        );
        setAvailable((prev) => [...prev, clickedAddon]);
      }
    } else {
      const clickedAddon = available?.find(
        (addon) => addon?.addonID === addOnId
      );
      if (clickedAddon) {
        setAvailable((prev) =>
          prev?.filter((addon) => addon?.addonID !== addOnId)
        );
        setSelected((prev) => [...prev, clickedAddon]);
      }
    }
  };

  return (
    <div className="col-span-2 w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col md:flex-row gap-6 text-sm">
          <DroppableList
            id="selected"
            title="Selected Add-ons"
            items={selected}
            emptyText="No add-ons selected"
            setRefetch={setRefetch}
            changeAddonCategory={changeAddonCategory}
          />
          <DroppableList
            id="available"
            title="Available Add-ons"
            items={available}
            emptyText="No available add-ons"
            setRefetch={setRefetch}
            changeAddonCategory={changeAddonCategory}
          />
        </div>
      </DndContext>
    </div>
  );
}
