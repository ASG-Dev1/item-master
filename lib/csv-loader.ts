import Papa from 'papaparse'

export interface ProductRow {
  id: number
  asgItemId: string
  nombreProducto: string
  descripcionCompleta: string
  precio: string
  categoria: string
  subcategoria: string
  agencia: string
  categoriaNigp: string
  subCategoriaNigp: string
  agenciaId: string
  modoAdquisicion: string
  idArticulo: string
  requisicionItemId: string
  licitacion: string
  marca: string
  modelo: string
  garantia: string
  numeroContrato: string
  numPartida: string
  renglon: string
}

interface CSVRow {
  'ASG-ITEM-ID': string
  'Nombre del Producto/Servicio': string
  'Descripción Completa del Producto/Servicio': string
  'Precio (Costo Estimado por Unidad)': string
  'Categoría': string
  'Subcategoría': string
  'Agencia': string
  'Categoria NIGP': string
  'Sub-Categoria NIGP': string
  'Agencia ID': string
  'Modo de Adquisición': string
  'ID Articulo': string
  'Requisicion Item ID': string
  'Licitacion': string
  'Marca': string
  'Modelo': string
  'Garantia': string
  'Número de contrato': string
  'Núm. de Partida': string
  'Renglón': string
}

let cachedData: ProductRow[] | null = null

export async function loadCSVData(): Promise<ProductRow[]> {
  if (cachedData) {
    return cachedData
  }

  try {
    const response = await fetch('/data/Sample_Item_Master.csv')
    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse<CSVRow>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const products: ProductRow[] = results.data.map((row, index) => ({
            id: index + 1,
            asgItemId: row['ASG-ITEM-ID'] || '',
            nombreProducto: row['Nombre del Producto/Servicio'] || '',
            descripcionCompleta: row['Descripción Completa del Producto/Servicio'] || '',
            precio: row['Precio (Costo Estimado por Unidad)'] || '',
            categoria: row['Categoría'] || '',
            subcategoria: row['Subcategoría'] || '',
            agencia: row['Agencia'] || '',
            categoriaNigp: row['Categoria NIGP'] || '',
            subCategoriaNigp: row['Sub-Categoria NIGP'] || '',
            agenciaId: row['Agencia ID'] || '',
            modoAdquisicion: row['Modo de Adquisición'] || '',
            idArticulo: row['ID Articulo'] || '',
            requisicionItemId: row['Requisicion Item ID'] || '',
            licitacion: row['Licitacion'] || '',
            marca: row['Marca'] || '',
            modelo: row['Modelo'] || '',
            garantia: row['Garantia'] || '',
            numeroContrato: row['Número de contrato'] || '',
            numPartida: row['Núm. de Partida'] || '',
            renglon: row['Renglón'] || '',
          }))

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
