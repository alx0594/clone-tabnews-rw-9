import useSWR from "swr";

async function fetchPage(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <UpdateAt />
      <Database />
    </>
  );
}

function UpdateAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchPage, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Carregando...";
  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <h3>Última Atualização: {updatedAtText}</h3>
    </div>
  );
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchPage);
  let databaseInformation = "Carregando...";
  if (!isLoading && data) {
    databaseInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Máximo de Conexões: {data.dependencies.database.max_connections}
        </div>
        <div>
          Conexões Abertas: {data.dependencies.database.opened_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h2>Banco de dados</h2>
      {databaseInformation}
    </>
  );
}
