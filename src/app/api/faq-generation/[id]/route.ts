import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "FAQ generation ID is required" },
        { status: 400 }
      )
    }

    // Fetch the specific FAQ generation
    const { data, error } = await supabase
      .from('faq_generations')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user can only access their own generations
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: "FAQ generation not found" },
          { status: 404 }
        )
      }
      
      console.error('Database error:', error)
      return NextResponse.json(
        { error: "Failed to fetch FAQ generation" },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: "FAQ generation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data, { status: 200 })
    
  } catch (err: unknown) {
    console.error("FAQ Generation Fetch API Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error" },
      { status: 500 }
    );
  }
}