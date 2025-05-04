import AntdTable from "@/components/antd-table"
import ChakraTable from "@/components/chakra-table"
import HtmlTable from "@/components/html-table"
import MantineTable from "@/components/mantine-table"
import MuiTable from "@/components/mui-table"
import ShadcnTable from "@/components/shadcn-table"
import { ThemeProvider } from "@/components/theme-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/components/ui/tabs"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Draggable Table Demo with dnd-kit</h1>
        <p className="text-center mb-8 max-w-2xl mx-auto">
          This demo showcases how to implement draggable tables using dnd-kit with various React UI libraries. Select a
          tab below to see different implementations.
        </p>

        <Tabs defaultValue="html" className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="shadcn">Shadcn UI</TabsTrigger>
            <TabsTrigger value="chakra">Chakra UI</TabsTrigger>
            <TabsTrigger value="mantine">Mantine</TabsTrigger>
            <TabsTrigger value="antd">Ant Design</TabsTrigger>
            <TabsTrigger value="mui">Material UI</TabsTrigger>
          </TabsList>
          <TabsContent value="html">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">HTML Table Implementation (restrictToWindowEdges)</h2>
              <HtmlTable />
            </div>
          </TabsContent>
          <TabsContent value="shadcn">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Shadcn UI Implementation (restrictToParentElement)</h2>
              <ShadcnTable />
            </div>
          </TabsContent>
          <TabsContent value="chakra">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Chakra UI Implementation</h2>
              <ChakraTable />
            </div>
          </TabsContent>
          <TabsContent value="mantine">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Mantine Implementation</h2>
              <MantineTable />
            </div>
          </TabsContent>
          <TabsContent value="antd">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Ant Design Implementation</h2>
              <AntdTable />
            </div>
          </TabsContent>
          <TabsContent value="mui">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Material UI Implementation (restrictToParentElement)</h2>
              <MuiTable />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </ThemeProvider>
  )
}
