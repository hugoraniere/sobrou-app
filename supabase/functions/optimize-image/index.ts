import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageOptimizationOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
  generateResponsive?: boolean
}

interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  optimizationLevel: string
  seoScore: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const formData = await req.formData()
    const file = formData.get('file') as File
    const bucketName = formData.get('bucketName') as string || 'landing-page'
    const uploadSource = formData.get('uploadSource') as string || 'manual'
    const category = formData.get('category') as string || 'general'
    const altText = formData.get('altText') as string || ''
    const tags = JSON.parse(formData.get('tags') as string || '[]')

    if (!file) {
      throw new Error('Nenhum arquivo fornecido')
    }

    console.log(`Processando imagem: ${file.name}, tamanho: ${file.size} bytes`)

    // Verificar se é uma imagem válida
    if (!file.type.startsWith('image/')) {
      throw new Error('Arquivo deve ser uma imagem')
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const originalFileName = file.name

    // Ler dados da imagem
    const imageBuffer = await file.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: file.type })

    // Calcular score SEO básico
    const seoScore = calculateSEOScore({
      hasAltText: !!altText,
      fileSize: file.size,
      fileName: file.name,
      hasOptimalSize: file.size < 500000 // 500KB
    })

    // Upload da imagem original
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, imageBlob, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      throw new Error('Erro ao fazer upload da imagem')
    }

    console.log('Upload realizado:', uploadData.path)

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName)

    // Simular análise de dimensões (em produção, usaria biblioteca de processamento de imagem)
    const metadata: ImageMetadata = {
      width: 1200, // Placeholder - seria extraído da imagem real
      height: 800, // Placeholder - seria extraído da imagem real
      format: file.type,
      size: file.size,
      optimizationLevel: 'medium',
      seoScore
    }

    // Salvar metadados no banco de dados
    const { data: dbData, error: dbError } = await supabase
      .from('gallery_images')
      .insert({
        file_name: fileName,
        original_name: originalFileName,
        file_path: uploadData.path,
        bucket_name: bucketName,
        file_size: file.size,
        mime_type: file.type,
        width: metadata.width,
        height: metadata.height,
        alt_text: altText,
        tags: tags,
        category: category,
        is_optimized: false, // Será true quando implementarmos otimização real
        optimization_level: metadata.optimizationLevel,
        formats_available: { original: true, webp: false, avif: false },
        seo_score: metadata.seoScore,
        upload_source: uploadSource
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar metadados:', dbError)
      // Não falha o upload por causa disso
    }

    console.log('Imagem processada com sucesso:', {
      fileName,
      size: file.size,
      seoScore: metadata.seoScore
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: dbData?.id,
          fileName,
          publicUrl: urlData.publicUrl,
          metadata,
          seoScore: metadata.seoScore
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Erro na otimização de imagem:', error)
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

function calculateSEOScore(factors: {
  hasAltText: boolean
  fileSize: number
  fileName: string
  hasOptimalSize: boolean
}): number {
  let score = 0

  // Alt text presente (40 pontos)
  if (factors.hasAltText) score += 40

  // Tamanho otimizado (30 pontos)
  if (factors.hasOptimalSize) score += 30

  // Nome de arquivo descritivo (20 pontos)
  if (factors.fileName.length > 5 && !factors.fileName.includes('IMG_')) {
    score += 20
  }

  // Bônus por tamanho muito pequeno (10 pontos)
  if (factors.fileSize < 100000) score += 10 // 100KB

  return Math.min(score, 100)
}