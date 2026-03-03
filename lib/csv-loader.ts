import Papa from 'papaparse'

export interface ProductRow {
  id: number
  asgItemId: string
  nombreProducto: string
  descripcionCompleta: string
  precio: string
  garantia: string
  categoria: string
  subcategoria: string
  numeroContrato: string
  agencia: string
  numPartida: string
  renglon: string
  marca: string
  modelo: string
}

interface CSVRow {
  Fecha_Recibo_de_Requisicion: string
  Numero_de_Caso: string
  Id_de_Requisicion: string
  Numero_de_Requisicion: string
  Titulo_de_Requisicion: string
  Categoria_de_Requisicion: string
  SubCategoria_de_Requisicion: string
  Comprador_Asignado: string
  Agencia: string
  Usuario_de_Agencia: string
  Nombre_de_Agencia_de_Entrega: string
  Metodo_de_Adquisicion: string
  Razon_de_Compra_Excepcional: string
  Uso_de_Fondos_Federales: string
  Id_de_Articulo: string
  Descripcion_de_Articulo: string
  Marca_de_Articulo: string
  Modelo_de_Articulo: string
  Garantia_de_Articulo: string
  Unidad_de_Medida: string
  Cantidad: string
  Costo_Unitario_Estimado_de_Articulo: string
  Costo_Estimado_Total_de_Orden_de_Articulo: string
  Numero_de_Contrato: string
  Estatus_de_Requisicion: string
  Costo_Final_de_Orden_de_Articulo: string
  Fecha_de_Fin_de_Requisicion: string
  Numero_de_Orden_de_Compra: string
  Id_de_Archivo_de_Orden_de_Compra: string
  Nombre_de_Archivo_de_Orden_de_Compra: string
  Url_de_Archivo_de_Orden_de_Compra: string
  Fecha_de_Orden_de_Compra: string
  Id_de_Suplidor: string
  Nombre_de_Suplidor: string
  Telefono_de_Contacto_de_Suplidor: string
  Email_de_Suplidor: string
  Costo_Unitario_Final_de_Articulo: string
}

let cachedData: ProductRow[] | null = null

export async function loadCSVData(): Promise<ProductRow[]> {
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetch('/data/_Clone_for_Sayaf__Silver_Table_Next_steps_md.csv')
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products: ProductRow[] = results.data.map((row, index) => {
            const costoFinal = row.Costo_Unitario_Final_de_Articulo || row.Costo_Unitario_Estimado_de_Articulo || '0'
            const precio = parseFloat(costoFinal) || 0

            return {
              id: parseInt(row.Id_de_Articulo) || index + 1,
              asgItemId: row.Id_de_Articulo || `ITEM-${index + 1}`,
              nombreProducto: row.Titulo_de_Requisicion || row.Descripcion_de_Articulo || 'Sin título',
              descripcionCompleta: row.Descripcion_de_Articulo || row.Titulo_de_Requisicion || '',
              precio: precio > 0 ? `$${precio.toFixed(2)}` : 'N/A',
              garantia: row.Garantia_de_Articulo || 'N/A',
              categoria: row.Categoria_de_Requisicion || '',
              subcategoria: row.SubCategoria_de_Requisicion || '',
              numeroContrato: row.Numero_de_Contrato || 'N/A',
              agencia: row.Agencia || '',
              numPartida: row.Numero_de_Requisicion || '',
              renglon: row.Numero_de_Caso || '',
              marca: row.Marca_de_Articulo || '',
              modelo: row.Modelo_de_Articulo || '',
            }
          })

          cachedData = products
          resolve(products)
        },
        error: (error: Error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error('Error loading CSV:', error)
    return []
  }
}
