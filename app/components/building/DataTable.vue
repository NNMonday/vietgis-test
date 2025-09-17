<template>
  <div id="datatable-bootstrap-css">
    <DataTable
      ref="table"
      :columns="columns"
      :options="options"
      class="table table-hover table-bordered"
    >
      <template #column-options="props">
        <div class="d-flex gap-2" @click.stop>
          <button
            @click.stop="handleEdit(props.rowData.id)"
            class="btn btn-sm btn-primary fw-medium px-3 py-1"
          >
            Edit
          </button>
          <button
            @click.stop="handleDelete(props.rowData.id)"
            class="btn btn-sm btn-danger fw-medium px-3 py-1"
          >
            Delete
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import type { Config, ConfigColumns } from "datatables.net";
import DataTable from "datatables.net-vue3";
import DataTableCore from "datatables.net-bs5";
import Swal from "sweetalert2";
import type Building from "~~/shared/types/building";

const emit = defineEmits<{
  buildingSelected: [building: Building];
  buildingUpdated: [];
}>();
const abortController = new AbortController();
const { deleteBuilding } = useBuilding();
const { handleError } = useToastHandler();
const table = ref();
DataTable.use(DataTableCore);
const columns: ConfigColumns[] = [
  { data: "id", visible: false },
  { data: "name", title: "Building Name" },
  { data: "address", title: "Address" },
  {
    data: "representative.name",
    title: "Representative Name",
    render: function (data: string, _, row: any) {
      return data || row.representative?.name || "-";
    },
  },
  {
    data: "representative.phone",
    title: "Phone Number",
    render: function (data: string, _, row: any) {
      return data || row.representative?.phone || "-";
    },
  },
  {
    data: "representative.cccd",
    title: "CCCD",
    render: function (data: string, _, row: any) {
      return data || row.representative?.cccd || "-";
    },
  },
  {
    data: "representative.cccdIssuedDate",
    title: "CCCD Issued Date",
    render: function (data: string, _, row: any) {
      const dateValue = data || row.representative?.cccdIssuedDate;
      if (!dateValue) return "-";
      try {
        return new Date(dateValue).toDateString();
      } catch {
        return "-";
      }
    },
  },
  {
    data: null,
    title: "Options",
    orderable: false,
    searchable: false,
    render: "#column-options",
  },
];
const options: Config = {
  serverSide: true,
  ajax: {
    url: "/api/building",
    error: function (_, error: string) {
      handleError(error);
    },
  },
  rowId: "id",
  pageLength: 10,
  searching: true,
  ordering: true,
  paging: true,
  info: true,
  processing: true,
  language: {
    search: "Search buildings:",
    lengthMenu: "Show _MENU_ buildings per page",
    info: "Showing _START_ to _END_ of _TOTAL_ buildings",
    infoEmpty: "No buildings found",
    infoFiltered: "(filtered from _MAX_ total buildings)",
    processing: "Loading buildings...",
  },
  createdRow: (row, data) => {
    row.addEventListener(
      "click",
      (_) => {
        emit("buildingSelected", data as Building);
      },
      {
        signal: abortController.signal,
      }
    );
  },
};

const handleEdit = async (id: string | number) => {
  await navigateTo(`/building/update/${id}`);
};
const handleDelete = async (id: number) => {
  const confirm = await Swal.fire({
    title: "Confirm",
    text: "Do you want to delete this building?",
    icon: "question",
    showCancelButton: true,
    cancelButtonText: "No",
    confirmButtonText: "Yes",
  });

  if (confirm.isConfirmed) {
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while we delete the building",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    await new Promise((r) => setTimeout(r, 500));
    try {
      await deleteBuilding(id);
      Swal.fire({
        title: "Success",
        text: "Building deleted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      table.value.dt.ajax.reload();
      emit("buildingUpdated");
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text:
          err.message ||
          "An unexpected error occurred while deleting the building",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }
};

onUnmounted(() => {
  abortController.abort();
});
</script>
