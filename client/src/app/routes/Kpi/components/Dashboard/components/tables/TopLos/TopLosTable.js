import { Box } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { roundTo } from 'round-to';
import prettifyNumber from '../../../../../../../functions/prettifyNumber';



export const TopLosTable = ({data}) => {

    return(
        <Box sx={{height: '20rem'}}>
            <TableContainer sx={{height: '100%', width: '100%'}}>
                <Table aria-label="Top 10 CCSR Average Stay" size="small">
                    <TableHead>
                    <TableRow>
                        <TableCell sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>CCSR</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Altas▽</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Observado</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Esperado</TableCell>
                        <TableCell align="center" sx={{fontWeight: 'bold', fontSize: '0.7rem'}}>Ratio</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((d) => (
                        <TableRow
                        key={d.ccsr}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell scope="row" size="small" sx={{fontSize: '0.7rem', maxWidth: '8rem'}}>
                                {d.ccsr}
                            </TableCell>
                            <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.discharges, 0))}</TableCell>
                            <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.observed_los, 2))}</TableCell>
                            <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.expected_los, 2))}</TableCell>
                            <TableCell align="center" size="small" sx={{fontSize: '0.7rem'}}>{prettifyNumber(roundTo(+d.ratio, 3))}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            
        </Box>
    )
};