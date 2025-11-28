function status(request, response) {
  response.status(200).json({ chave: "status ok" });
}

export default status;
