
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileSpreadsheet, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  jewelryType: string;
  metal: string;
  purity: string;
  size: string;
  gemName: string;
  gemstoneWeight: string;
  diaColor: string;
  diaClarity: string;
  diaWeight: string;
  numberOfStones: string;
  diaStoneWeight: string;
  grossWeight: string;
  netWeight: string;
  goldWeight18kt: string;
  makingCharges: string;
  expectedDeliveryDate: string;
  actualDeliveryDate: string;
  deliveryStatus: string;
  orderGivenBy: string;
}

interface GoogleSheetsExportProps {
  orders: Order[];
}

const GoogleSheetsExport: React.FC<GoogleSheetsExportProps> = ({ orders }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleApiKey') || '');
  const [spreadsheetId, setSpreadsheetId] = useState(localStorage.getItem('googleSpreadsheetId') || '');
  const [isExporting, setIsExporting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const saveCredentials = () => {
    localStorage.setItem('googleApiKey', apiKey);
    localStorage.setItem('googleSpreadsheetId', spreadsheetId);
    toast({
      title: "Credentials Saved",
      description: "Google Sheets credentials have been saved locally.",
    });
    setDialogOpen(false);
  };

  const exportToGoogleSheets = async () => {
    if (!apiKey || !spreadsheetId) {
      toast({
        title: "Configuration Required",
        description: "Please configure your Google Sheets API key and Spreadsheet ID first.",
        variant: "destructive",
      });
      setDialogOpen(true);
      return;
    }

    setIsExporting(true);
    console.log("Starting Google Sheets export...");

    try {
      // Prepare the data for Google Sheets
      const headers = [
        'Order Number', 'Customer Name', 'Order Date', 'Jewelry Type', 'Metal', 'Purity', 'Size',
        'Gem Name', 'Gemstone Weight', 'Diamond Color', 'Diamond Clarity', 'Diamond Weight (ct)',
        'Number of Stones', 'Diamond & Stone Weight (g)', 'Gross Weight', 'Net Weight',
        'Gold Weight (18kt)', 'Making Charges', 'Expected Delivery', 'Actual Delivery',
        'Delivery Status', 'Order Given By'
      ];

      const rows = orders.map(order => [
        order.orderNumber,
        order.customerName,
        order.orderDate,
        order.jewelryType,
        order.metal,
        order.purity,
        order.size,
        order.gemName,
        order.gemstoneWeight,
        order.diaColor,
        order.diaClarity,
        order.diaWeight,
        order.numberOfStones,
        order.diaStoneWeight,
        order.grossWeight,
        order.netWeight,
        order.goldWeight18kt,
        order.makingCharges,
        order.expectedDeliveryDate,
        order.actualDeliveryDate,
        order.deliveryStatus,
        order.orderGivenBy
      ]);

      const values = [headers, ...rows];

      // Call Google Sheets API
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:clear?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clear existing data');
      }

      // Add new data
      const updateResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:append?valueInputOption=RAW&key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: values,
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update Google Sheet');
      }

      toast({
        title: "Export Successful",
        description: `Successfully exported ${orders.length} orders to Google Sheets.`,
      });

      console.log("Google Sheets export completed successfully");
    } catch (error) {
      console.error("Error exporting to Google Sheets:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export to Google Sheets. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={exportToGoogleSheets} 
        disabled={isExporting}
        className="bg-green-600 hover:bg-green-700"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export to Google Sheets'}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Google Sheets Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">Google API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google API key"
              />
            </div>
            <div>
              <Label htmlFor="spreadsheetId">Google Spreadsheet ID</Label>
              <Input
                id="spreadsheetId"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Enter your Google Spreadsheet ID"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>To get started:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Enable Google Sheets API in Google Cloud Console</li>
                <li>Create an API key with Sheets API access</li>
                <li>Create a new Google Sheet and copy its ID from the URL</li>
                <li>Make sure the sheet is publicly editable or share it with your service account</li>
              </ol>
            </div>
            <Button onClick={saveCredentials} className="w-full">
              Save Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoogleSheetsExport;
