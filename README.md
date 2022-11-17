# lighthouse-report-formatter

Format lighthouse reports into Markdown table.

## Inputs

### `lh_directory`

Directory path to which the lighthouse is applied.

### `mainfest_path`

**Required** Path to which the reports manifest.json is saved.

## Outputs

### `comments`

String that represents every reports in markdown table format.

## Example Usage

```yaml
uses: iyu88/lighthouse-report-formatter@v1.0.0
with:
  lh_directory: ./
  mainfest_path: lhci_reports
```
