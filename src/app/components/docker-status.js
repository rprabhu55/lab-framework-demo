import { getAllContainerStatus } from "@/lib/containers";

/**
 * DockerStatus component
 * 
 * @returns {JSX.Element}
 */
export async function DockerStatus() {
  const status = await getAllContainerStatus()

  return (
    <div className="container mx-auto">
      <div className="max-w-2xl rounded overflow-hidden shadow-2xl">
        <div className="font-bold text-xl mb-2">Docker Containers Running</div>
        <div className="px-6 py-4">
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Running For</th>
              </tr>
              {status.map((item, index) => (
                <tr key={index}>
                  <td>{item.Names}</td>
                  <td>{item.Status}</td>
                  <td>{item.RunningFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div >
  );
}
