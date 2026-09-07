from pathlib import Path

path=Path("index.html")
text=path.read_text(encoding="utf-8")

old='''  const { error } = await supabaseClient
    .from("clients")
    .update({
      status:"Revisado"
    })
    .eq("id",id);

  if(error){

    console.error(
      "Error guardando estado del check-in:",
      error
    );

    toast("No se pudo guardar la revisión");

    return;
  }
'''

new='''  const reviewedAt = new Date().toISOString();

  const { error:checkinError } = await supabaseClient
    .from("client_checkins")
    .update({
      reviewed:true,
      updated_at:reviewedAt
    })
    .eq("client_id",id);

  if(checkinError){

    console.error(
      "Error guardando revisión del check-in:",
      checkinError
    );

    toast("No se pudo guardar la revisión");

    return;
  }

  const { error:clientError } = await supabaseClient
    .from("clients")
    .update({
      status:"Revisado"
    })
    .eq("id",id);

  if(clientError){
    console.error(
      "Check-in revisado, pero no se pudo actualizar el estado del cliente:",
      clientError
    );
  }
'''

if new in text:
    print("Check-in reviewed persistence already fixed")
elif old in text:
    if text.count(old) != 1:
        raise RuntimeError(f"Expected one markReviewed server block, found {text.count(old)}")
    text=text.replace(old,new,1)
    path.write_text(text,encoding="utf-8")
    print("Check-in reviewed persistence fixed")
else:
    raise RuntimeError("markReviewed persistence block not found")
